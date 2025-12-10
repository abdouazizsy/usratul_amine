import { useLanguage } from '../contexts/LanguageContext'
import { getTranslation } from '../translations/translations'

export const useTranslation = () => {
  const { language } = useLanguage()
  
  const t = (key) => getTranslation(language, key)
  
  return { t, language }
}
