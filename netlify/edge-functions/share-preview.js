// Aperçus de partage (WhatsApp, Facebook, X…) propres à chaque page.
// Le site est une application React : sans ce relais, tous les liens partagés affichent
// l'aperçu général du site. Ici, on réécrit les balises Open Graph de la page avant de l'envoyer.

const SITE = 'https://usratulamine.sn'
const FIRESTORE = 'https://firestore.googleapis.com/v1/projects/usratul-amine/databases/(default)/documents'
const DESCRIPTION_MAX = 200

const STATIC_PAGES = {
  '/accreditation': {
    title: 'Accréditation presse — 72h Usratul Amine, édition 2026',
    description: "Journalistes, reporters, photographes et influenceurs : demandez votre accréditation pour couvrir les 72h d'Usratul Amine.",
    image: `${SITE}/logo-og-v2.png`,
    width: 1200,
    height: 630
  }
}

const escapeHtml = (text) =>
  String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

const truncate = (text, max) => {
  const clean = String(text || '').replace(/\s+/g, ' ').trim()
  return clean.length > max ? `${clean.slice(0, max - 1).replace(/\s+\S*$/, '')}…` : clean
}

// Les images Cloudinary sont recadrées au format 1200×630 attendu par les aperçus
const shareImage = (images, videos) => {
  const photo = images?.[0]
  if (photo?.includes('res.cloudinary.com') && photo.includes('/upload/')) {
    return { url: photo.replace('/upload/', '/upload/c_fill,g_auto,w_1200,h_630,q_auto,f_jpg/'), width: 1200, height: 630 }
  }
  if (photo) return { url: photo }
  const youtubeId = (videos || [])
    .map(v => v.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|live\/|shorts\/|embed\/))([\w-]{11})/)?.[1])
    .find(Boolean)
  if (youtubeId) return { url: `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`, width: 480, height: 360 }
  return null
}

const readValue = (field) => {
  if (!field) return undefined
  if ('arrayValue' in field) return (field.arrayValue.values || []).map(readValue)
  return Object.values(field)[0]
}

const newsMeta = async (id, pathname) => {
  const response = await fetch(`${FIRESTORE}/actualites/${id}`)
  if (!response.ok) return null
  const fields = Object.fromEntries(
    Object.entries((await response.json()).fields || {}).map(([key, value]) => [key, readValue(value)])
  )
  if (fields.published === false || !fields.title) return null
  const image = shareImage(fields.images, fields.videos)
  return {
    type: 'article',
    title: fields.title,
    description: truncate(fields.excerpt || fields.content, DESCRIPTION_MAX),
    image: image?.url || `${SITE}/logo-og-v2.png`,
    width: image ? image.width : 1200,
    height: image ? image.height : 630,
    url: `${SITE}${pathname}`
  }
}

// Remplace (ou ajoute) <meta {attr}="{key}" content="…">
const setMeta = (html, attr, key, value) => {
  const tag = `<meta ${attr}="${key}" content="${escapeHtml(value)}" />`
  const pattern = new RegExp(`<meta\\s+${attr}="${key}"\\s+content="[^"]*"\\s*/?>`)
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace('</head>', `    ${tag}\n  </head>`)
}

const removeMeta = (html, attr, key) =>
  html.replace(new RegExp(`\\s*<meta\\s+${attr}="${key}"\\s+content="[^"]*"\\s*/?>`), '')

export const applyMeta = (html, meta) => {
  let result = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(meta.title)}</title>`)
  result = setMeta(result, 'name', 'description', meta.description)
  result = setMeta(result, 'property', 'og:type', meta.type || 'website')
  result = setMeta(result, 'property', 'og:url', meta.url)
  result = setMeta(result, 'property', 'og:title', meta.title)
  result = setMeta(result, 'property', 'og:description', meta.description)
  result = setMeta(result, 'property', 'og:image', meta.image)
  if (meta.width && meta.height) {
    result = setMeta(result, 'property', 'og:image:width', String(meta.width))
    result = setMeta(result, 'property', 'og:image:height', String(meta.height))
  } else {
    result = removeMeta(result, 'property', 'og:image:width')
    result = removeMeta(result, 'property', 'og:image:height')
  }
  result = setMeta(result, 'name', 'twitter:url', meta.url)
  result = setMeta(result, 'name', 'twitter:title', meta.title)
  result = setMeta(result, 'name', 'twitter:description', meta.description)
  result = setMeta(result, 'name', 'twitter:image', meta.image)
  return result
}

export default async (request, context) => {
  const { pathname } = new URL(request.url)

  let meta = null
  try {
    const newsId = pathname.match(/^\/actualites\/([A-Za-z0-9]{10,40})\/?$/)?.[1]
    if (newsId) meta = await newsMeta(newsId, pathname)
    else if (STATIC_PAGES[pathname.replace(/\/$/, '')]) {
      meta = { ...STATIC_PAGES[pathname.replace(/\/$/, '')], url: `${SITE}${pathname}` }
    }
  } catch (error) {
    console.error('share-preview:', error)
  }

  const response = await context.next()
  if (!meta || !response.headers.get('content-type')?.includes('text/html')) return response

  const headers = new Headers(response.headers)
  headers.delete('content-length')
  return new Response(applyMeta(await response.text(), meta), { status: response.status, headers })
}

export const config = { path: ['/actualites/*', '/accreditation'] }
