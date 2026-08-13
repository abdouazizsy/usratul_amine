// Renvoie la version traduite d'un champ (ex: title_ar, title_en) si elle existe pour la
// langue active, sinon retombe sur le champ français original.
export const pickLocalized = (item, field, language) => {
  if (!item) return ''
  if (language && language !== 'fr' && item[`${field}_${language}`]) return item[`${field}_${language}`]
  return item[field] || ''
}
