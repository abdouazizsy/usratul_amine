import { AwsClient } from 'aws4fetch';

// Gestion des fichiers audio sur Cloudflare R2 (réservé aux admins connectés).
// - action "presign" : renvoie une URL signée pour envoyer un fichier directement du navigateur vers R2
// - action "delete"  : supprime un fichier
//
// Variables d'environnement Netlify requises :
//   R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_PUBLIC_URL

const FIREBASE_API_KEY = 'AIzaSyDDefTT0RdZEs6R1En_7NIGNhqoR2La20k';
const ALLOWED_PREFIX = 'audio/';
const UPLOAD_URL_TTL_SECONDS = 3600;

const json = (statusCode, body) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body)
});

// Vérifie le jeton Firebase de l'admin auprès de Google
const verifyAdmin = async (idToken) => {
  if (!idToken) return false;
  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FIREBASE_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken })
  });
  if (!response.ok) return false;
  const data = await response.json();
  return Array.isArray(data.users) && data.users.length > 0;
};

const isValidKey = (key) =>
  typeof key === 'string' && key.startsWith(ALLOWED_PREFIX) && !key.includes('..') && /^[\w\-./]+$/.test(key);

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_PUBLIC_URL } = process.env;
  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET || !R2_PUBLIC_URL) {
    return json(500, { error: "Le stockage R2 n'est pas configuré (variables d'environnement manquantes)." });
  }

  try {
    const idToken = (event.headers.authorization || '').replace(/^Bearer\s+/i, '');
    if (!(await verifyAdmin(idToken))) {
      return json(401, { error: 'Non autorisé' });
    }

    const { action, key } = JSON.parse(event.body || '{}');
    if (!isValidKey(key)) {
      return json(400, { error: 'Nom de fichier invalide' });
    }

    const r2 = new AwsClient({
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
      service: 's3',
      region: 'auto'
    });
    const objectUrl = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_BUCKET}/${key}`;

    if (action === 'presign') {
      const signed = await r2.sign(
        new Request(`${objectUrl}?X-Amz-Expires=${UPLOAD_URL_TTL_SECONDS}`, { method: 'PUT' }),
        { aws: { signQuery: true } }
      );
      return json(200, {
        uploadUrl: signed.url,
        publicUrl: `${R2_PUBLIC_URL.replace(/\/$/, '')}/${key}`
      });
    }

    if (action === 'delete') {
      const response = await r2.fetch(objectUrl, { method: 'DELETE' });
      if (!response.ok && response.status !== 404) {
        return json(502, { error: 'Suppression impossible' });
      }
      return json(200, { deleted: true });
    }

    return json(400, { error: 'Action inconnue' });
  } catch (error) {
    console.error('r2 function error:', error);
    return json(500, { error: 'Erreur serveur' });
  }
};
