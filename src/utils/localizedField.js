// Renvoie la version arabe d'un champ si elle existe et que la langue active est 'ar',
// sinon retombe sur le champ français original.
export const pickLocalized = (item, field, language) => {
  if (!item) return ''
  if (language === 'ar' && item[`${field}_ar`]) return item[`${field}_ar`]
  return item[field] || ''
}
