// Accréditations presse : listes de choix (libellés publics dans translations: accreditation.*)

export const MEDIA_TYPES = [
  { id: 'tv', label: 'Télévision' },
  { id: 'radio', label: 'Radio' },
  { id: 'print', label: 'Presse écrite' },
  { id: 'web', label: 'Presse en ligne / Web' },
  { id: 'social', label: 'Réseaux sociaux' },
  { id: 'agency', label: 'Agence de presse' },
  { id: 'other', label: 'Autre' }
]

export const ROLES = [
  { id: 'journalist', label: 'Journaliste / Reporter' },
  { id: 'camera', label: 'Cameraman / Vidéaste' },
  { id: 'photographer', label: 'Photographe' },
  { id: 'influencer', label: 'Influenceur / Créateur de contenu' },
  { id: 'technician', label: 'Technicien' },
  { id: 'other', label: 'Autre' }
]

export const STATUSES = [
  { id: 'pending', label: 'En attente', className: 'bg-amber-100 text-amber-800' },
  { id: 'approved', label: 'Accrédité', className: 'bg-emerald-100 text-emerald-800' },
  { id: 'rejected', label: 'Refusé', className: 'bg-red-100 text-red-700' }
]

export const labelOf = (list, id) => list.find(item => item.id === id)?.label || id || ''

export const MAX_PHOTO_BYTES = 8 * 1024 * 1024

// Réglages par défaut, utilisés tant qu'ils ne sont pas enregistrés dans l'admin
export const ACCREDITATION_DEFAULTS = {
  eventName: '72h Usratul Amine, édition 2026',
  opensAt: '2026-11-23T08:00',
  closesAt: '2026-12-11T17:00'
}

export const DEFAULT_TEMPLATES = {
  approved: `Bonjour {prenom} {nom},

Votre demande d'accréditation presse pour « {evenement} » a été acceptée.

Média : {media}
Fonction : {fonction}

Merci de vous présenter à l'accueil presse muni de votre carte de presse ou d'une pièce d'identité pour récupérer votre badge.

Usratul Amine`,
  rejected: `Bonjour {prenom} {nom},

Nous vous remercions pour votre demande d'accréditation pour « {evenement} ». Nous ne pouvons malheureusement pas y donner une suite favorable cette fois-ci.

Cordialement,
Usratul Amine`
}

// Remplace {prenom}, {nom}, {evenement}, {media}, {fonction} par les infos du journaliste
export const fillTemplate = (template, item) =>
  (template || '')
    .replace(/\{prenom\}/g, item.firstName || '')
    .replace(/\{nom\}/g, item.lastName || '')
    .replace(/\{evenement\}/g, item.event || '')
    .replace(/\{media\}/g, item.media || '')
    .replace(/\{fonction\}/g, labelOf(ROLES, item.role))

// Numéro au format international pour WhatsApp (wa.me) ; les numéros sénégalais à 9 chiffres reçoivent l'indicatif 221
export const toWhatsAppNumber = (phone) => {
  let digits = (phone || '').replace(/\D/g, '')
  if (digits.startsWith('00')) digits = digits.slice(2)
  if (digits.length === 9 && /^[37]/.test(digits)) digits = `221${digits}`
  return digits.length >= 8 ? digits : null
}

// Les dates d'ouverture sont saisies à l'heure de Dakar (GMT, sans heure d'été)
export const parseDakarTime = (value) => {
  if (!value) return null
  const date = new Date(`${value}:00Z`)
  return Number.isNaN(date.getTime()) ? null : date
}

// "open" | "upcoming" | "ended" | "closed"
export const accreditationWindow = (settings, now = new Date()) => {
  if (!settings?.open) return 'closed'
  const opensAt = parseDakarTime(settings.opensAt)
  const closesAt = parseDakarTime(settings.closesAt)
  if (opensAt && now < opensAt) return 'upcoming'
  if (closesAt && now >= closesAt) return 'ended'
  return 'open'
}

const LOCALES = { fr: 'fr-FR', en: 'en-GB', ar: 'ar-u-ca-gregory-nu-latn' }

// "lundi 23 novembre 2026 à 8 h" (fr), "Monday 23 November 2026 at 8:00" (en)
export const formatDakarDateTime = (value, language, atWord) => {
  const date = parseDakarTime(value)
  if (!date) return ''
  const day = date.toLocaleDateString(LOCALES[language] || LOCALES.fr, {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Africa/Dakar'
  })
  const hours = date.getUTCHours()
  const minutes = String(date.getUTCMinutes()).padStart(2, '0')
  const time = language === 'fr' || !LOCALES[language]
    ? `${hours} h${minutes === '00' ? '' : ` ${minutes}`}`
    : `${hours}:${minutes}`
  return `${day} ${atWord} ${time}`
}
