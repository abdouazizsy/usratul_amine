# Guide d'importation des Hadaras Djouma

## 📚 Vue d'ensemble

Ce guide explique comment importer les 70 Hadaratoul Jumu'ah 2026/2027 dans Firebase.

## 🎯 Données

- **Total**: 70 Hadaras Djouma
- **Période**: Mars 2026 - Avril 2027
- **Hadaras Populaires**: 4 événements majeurs
  - Tabaski (26 mai 2026)
  - Achoura (26 juin 2026)
  - Gamou Tivaouine (26 août 2026)
  - Khadara National (05 février 2027)

## 🚀 Importation dans Firebase

### Option 1: Via le Dashboard Admin

1. Connectez-vous au dashboard admin: `/admin`
2. Allez dans la section "Hadara Djouma" (à ajouter)
3. Cliquez sur "Importer les données"
4. Les 70 événements seront automatiquement importés

### Option 2: Via la console du navigateur

1. Ouvrez la page `/hadara-djouma`
2. Ouvrez la console du navigateur (F12)
3. Exécutez:

```javascript
import { importHadaraDjoumaToFirebase } from './utils/importHadaraDjouma'
await importHadaraDjoumaToFirebase()
```

### Option 3: Script Node.js (à créer)

Créez un script d'importation standalone si nécessaire.

## 📊 Structure des données

Chaque Hadara Djouma contient:

```javascript
{
  id: Number,              // ID unique
  title: String,           // Nom de la Hadara
  date: String,            // Format: "YYYY-MM-DD"
  location: String,        // Lieu de l'événement
  isPopular: Boolean,      // true pour les 4 Hadaras populaires
  description: String,     // Description (optionnel)
  category: "HADARA_DJOUMA", // Catégorie fixe
  createdAt: String        // Date de création ISO
}
```

## 🎨 Design distinctif

### Hadaras Populaires
- **Fond**: Dégradé violet → bleu → rose
- **Badge**: ⭐ HADARA POPULAIRE ⭐ avec animation
- **Barre supérieure**: Or animé avec pulse
- **Bouton**: Dégradé or avec effet hover
- **Effet**: Brillance et ombre animée

### Hadaras Régulières
- **Fond**: Blanc avec bordure
- **Barre supérieure**: Dégradé violet → bleu → rose
- **Hover**: Bordure violette
- **Design**: Épuré et élégant

## 🔗 Routes

- **Page principale**: `/hadara-djouma`
- **Collection Firebase**: `hadara_djouma_events`

## ✨ Fonctionnalités

- ✅ Recherche par nom ou lieu
- ✅ Filtre "Populaires uniquement"
- ✅ Séparation événements futurs/passés
- ✅ Modale de détails
- ✅ Design ultra-moderne et distinctif
- ✅ Animations fluides
- ✅ Responsive mobile

## 📝 Notes

- Les Hadaras populaires sont automatiquement mises en avant
- Le design est époustouflant et très distinctif
- Les données sont triées par date
- La page est entièrement responsive

## 🎯 Prochaines étapes

1. Importer les 70 Hadaras dans Firebase
2. Tester la page `/hadara-djouma`
3. Vérifier l'affichage des Hadaras populaires
4. Ajuster le design si nécessaire
