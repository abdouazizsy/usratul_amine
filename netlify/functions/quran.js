// Relais vers la Content API de Quran Foundation (le Client Secret reste côté serveur).
// Appel : /.netlify/functions/quran?path=/chapters&language=fr
//
// Variables d'environnement Netlify :
//   QF_CLIENT_ID, QF_CLIENT_SECRET  (Developer Console → Credentials)
//   QF_ENV    : "production" (défaut) ou "prelive" (test : seules les sourates 1 et 2)
//   QF_SCOPE  : facultatif, "content" par défaut

const ENVIRONMENTS = {
  production: { auth: 'https://oauth2.quran.foundation', api: 'https://apis.quran.foundation' },
  prelive: { auth: 'https://prelive-oauth2.quran.foundation', api: 'https://apis-prelive.quran.foundation' }
};

// Seules ces routes de lecture sont relayées
const ALLOWED_PATHS = [
  /^\/chapters$/,
  /^\/chapters\/\d{1,3}$/,
  /^\/chapters\/\d{1,3}\/info$/,
  /^\/verses\/by_chapter\/\d{1,3}$/,
  /^\/chapter_recitations\/\d{1,3}\/\d{1,3}$/,
  /^\/resources\/translations$/,
  /^\/resources\/recitations$/
];

const ALLOWED_PARAMS = ['language', 'translations', 'fields', 'audio', 'page', 'per_page', 'words'];

// Le contenu du Coran ne change pas : on laisse le CDN de Netlify le garder une journée
const CACHE_HEADERS = { 'Cache-Control': 'public, max-age=3600, s-maxage=86400' };

let cachedToken = null; // { value, expiresAt } — réutilisé tant que la fonction reste "chaude"

const requestToken = async (env, scope) => {
  const { QF_CLIENT_ID, QF_CLIENT_SECRET } = process.env;
  const body = new URLSearchParams({ grant_type: 'client_credentials' });
  if (scope) body.set('scope', scope);
  return fetch(`${env.auth}/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${QF_CLIENT_ID}:${QF_CLIENT_SECRET}`).toString('base64')}`
    },
    body
  });
};

const getToken = async (env) => {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) return cachedToken.value;

  let response = await requestToken(env, process.env.QF_SCOPE || 'content');
  // Les applications récentes ont des permissions détaillées : on redemande alors sans scope
  if (response.status === 400) {
    const error = await response.clone().json().catch(() => ({}));
    if (error.error === 'invalid_scope') response = await requestToken(env, null);
  }
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Jeton refusé (${response.status}) : ${text.slice(0, 200)}`);
  }

  const data = await response.json();
  cachedToken = { value: data.access_token, expiresAt: Date.now() + (data.expires_in || 3600) * 1000 };
  return cachedToken.value;
};

const json = (statusCode, body, headers = {}) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json', ...headers },
  body: JSON.stringify(body)
});

export const handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { QF_CLIENT_ID, QF_CLIENT_SECRET, QF_ENV } = process.env;
  const env = ENVIRONMENTS[QF_ENV || 'production'];
  if (!QF_CLIENT_ID || !QF_CLIENT_SECRET || !env) {
    return json(500, { error: "L'API du Coran n'est pas configurée (variables d'environnement manquantes)." });
  }

  const params = event.queryStringParameters || {};
  const path = params.path || '';
  if (!ALLOWED_PATHS.some(pattern => pattern.test(path))) {
    return json(400, { error: 'Route non autorisée' });
  }

  const query = new URLSearchParams();
  ALLOWED_PARAMS.forEach(key => {
    if (params[key]) query.set(key, params[key]);
  });

  try {
    const url = `${env.api}/content/api/v4${path}${query.toString() ? `?${query}` : ''}`;
    const call = async () =>
      fetch(url, { headers: { 'x-auth-token': await getToken(env), 'x-client-id': QF_CLIENT_ID } });

    let response = await call();
    if (response.status === 401) {
      // Jeton expiré ou révoqué : on en redemande un une fois
      cachedToken = null;
      response = await call();
    }

    const text = await response.text();
    return {
      statusCode: response.status,
      headers: { 'Content-Type': 'application/json', ...(response.ok ? CACHE_HEADERS : {}) },
      body: text
    };
  } catch (error) {
    console.error('quran function error:', error);
    return json(502, { error: 'Le service du Coran est momentanément indisponible.' });
  }
};
