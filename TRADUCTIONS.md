# 🌐 Système de Traduction Multilingue

Le site Usratul Amine supporte maintenant **3 langues** :
- 🇫🇷 **Français** (par défaut)
- 🇸🇦 **العربية Arabe**
- 🇬🇧 **English**

## 📱 Comment ça fonctionne

### Sélecteur de langue dans la navbar
Un bouton avec un globe 🌍 permet aux visiteurs de changer de langue instantanément. La sélection est sauvegardée dans le navigateur.

### Composants traduits
- ✅ **Navigation** (tous les liens du menu)
- ✅ **Hero** (page d'accueil)
- 🔄 **About** (à traduire)
- 🔄 **Biography** (à traduire)
- 🔄 **Program** (à traduire)
- 🔄 **Message** (à traduire)
- 🔄 **Contact** (à traduire)
- 🔄 **Footer** (à traduire)

## 🛠️ Comment ajouter des traductions à un composant

### Étape 1 : Importer le hook
```javascript
import { useTranslation } from '../hooks/useTranslation'
```

### Étape 2 : Utiliser le hook dans le composant
```javascript
const MonComposant = () => {
  const { t, language } = useTranslation()
  
  // ...
}
```

### Étape 3 : Utiliser les traductions
```javascript
// Au lieu de :
<h1>Biographie</h1>

// Utiliser :
<h1>{t('biography.title')}</h1>
```

### Étape 4 : Gérer la police arabe
Pour le texte en arabe, ajouter la classe `font-arabic` :
```javascript
<p className={`text-xl ${language === 'ar' ? 'font-arabic' : ''}`}>
  {t('about.intro1')}
</p>
```

## 📝 Exemple complet

```javascript
import React from 'react'
import { useTranslation } from '../hooks/useTranslation'

const MonComposant = () => {
  const { t, language } = useTranslation()
  
  return (
    <div>
      <h2 className={language === 'ar' ? 'font-arabic' : ''}>
        {t('contact.title')}
      </h2>
      <p className={language === 'ar' ? 'font-arabic' : ''}>
        {t('contact.subtitle')}
      </p>
    </div>
  )
}
```

## 📚 Structure des traductions

Les traductions sont dans `/src/translations/translations.js` :

```javascript
export const translations = {
  fr: {
    hero: {
      title: "Usratul Amine",
      subtitle: "Préserver l'héritage..."
    }
  },
  ar: {
    hero: {
      title: "أسرة الأمين",
      subtitle: "الحفاظ على..."
    }
  },
  en: {
    hero: {
      title: "Usratul Amine",
      subtitle: "Preserving the legacy..."
    }
  }
}
```

## ➕ Ajouter de nouvelles traductions

1. Ouvrir `/src/translations/translations.js`
2. Ajouter votre clé dans les 3 langues (fr, ar, en)
3. Utiliser avec `t('votre.cle')`

### Exemple :
```javascript
// Dans translations.js
fr: {
  events: {
    upcoming: "Événements à venir",
    past: "Événements passés"
  }
},
ar: {
  events: {
    upcoming: "الأحداث القادمة",
    past: "الأحداث الماضية"
  }
},
en: {
  events: {
    upcoming: "Upcoming Events",
    past: "Past Events"
  }
}

// Dans votre composant
<h3>{t('events.upcoming')}</h3>
<h3>{t('events.past')}</h3>
```

## 🎨 Direction du texte (RTL pour l'arabe)

L'arabe s'affiche de droite à gauche automatiquement grâce à la police Amiri.

## 💾 Persistance

La langue sélectionnée est sauvegardée dans `localStorage` et restaurée automatiquement lors de la prochaine visite.

## 🔄 Composants restants à traduire

Pour traduire les autres composants, suivez le même pattern :

1. Importer `useTranslation`
2. Ajouter les traductions dans `translations.js`
3. Remplacer le texte par `t('cle.de.traduction')`
4. Ajouter `font-arabic` pour le texte en arabe

---

**Note** : Toutes les traductions sont déjà préparées dans le fichier `translations.js`, il suffit de les utiliser dans chaque composant !
