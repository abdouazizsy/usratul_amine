export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { fields } = JSON.parse(event.body);

    if (!fields || typeof fields !== 'object') {
      return { statusCode: 400, body: JSON.stringify({ error: 'fields is required' }) };
    }

    const entries = Object.entries(fields).filter(([, value]) => typeof value === 'string' && value.trim());
    if (entries.length === 0) {
      return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) };
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        response_format: { type: 'json_object' },
        temperature: 0.2,
        messages: [
          {
            role: 'system',
            content: 'Tu traduis du français vers l\'arabe littéraire moderne pour le site d\'une association soufie tidiane (Usratul Amine, Tivaouane, Sénégal). Respecte le registre religieux et culturel (noms propres, titres comme "Serigne", termes de la Tariqa) sans les dénaturer. Réponds uniquement avec un objet JSON dont les clés sont exactement celles fournies en entrée et les valeurs leur traduction arabe.'
          },
          {
            role: 'user',
            content: JSON.stringify(Object.fromEntries(entries))
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return { statusCode: response.status, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) };
    }

    const raw = data.choices?.[0]?.message?.content || '{}';
    const translated = JSON.parse(raw);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(translated)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
