# 🌟 Guide d'utilisation - Site Usratul Amine

## 📋 Instructions de lancement

Une fois Node.js installé, suivez ces étapes:

### 1. Installer les dépendances

```bash
cd /Users/abdouazizsyndiaye/CascadeProjects/usratul-amine
npm install
```

Cette commande va installer:
- React & React DOM
- Vite (serveur de développement ultra-rapide)
- TailwindCSS (styles)
- Framer Motion (animations)
- Lucide React (icônes)

### 2. Lancer le site en développement

```bash
npm run dev
```

Le site sera accessible à l'adresse: **http://localhost:5173**

### 3. Construire pour la production

```bash
npm run build
```

Les fichiers optimisés seront générés dans le dossier `dist/`

## 🎨 Personnalisation

### Ajouter le logo officiel
Placez votre logo dans `/public/logo-og-v2.png`

### Modifier les couleurs
Éditez `tailwind.config.js` pour ajuster les couleurs personnalisées.

### Ajouter des sections
Créez de nouveaux composants dans `/src/components/` et importez-les dans `App.jsx`

## 📱 Fonctionnalités du site

### Navigation fluide
- Cliquez sur les liens du menu pour naviguer entre les sections
- Défilement automatique et en douceur

### Sections principales

1. **Hero (Accueil)**
   - Présentation accrocheuse avec animations
   - Logo et titre de l'association
   - Bouton d'appel à l'action

2. **À propos**
   - Histoire de l'association
   - Mission et valeurs
   - 4 piliers: Éducation, Héritage, Communauté, Excellence

3. **Programme 2025**
   - Dates: 19-20-21 Décembre 2025
   - Lieu: Tivaouane
   - Détails de l'événement
   - Contact Zawiya TV

4. **Message du Coordinateur**
   - Message inspirant de Serigne Sidy Ahmed Sy Al Amine
   - Design élégant avec fond vert émeraude

5. **Contact**
   - Téléphone: 77 874 62 82
   - Site web: www.zawiya.sn
   - Localisation: Tivaouane

### Design & Animations

- **Couleurs**: Vert émeraude (#047857) et Or (#B8860B) du logo
- **Typographies**: 
  - Playfair Display (titres élégants)
  - Amiri (texte arabe)
- **Motifs**: Patterns islamiques subtils en arrière-plan
- **Animations**: Transitions fluides avec Framer Motion
- **Responsive**: Fonctionne parfaitement sur mobile, tablette et desktop

## 🚀 Déploiement

### Option 1: Netlify (Recommandé)

1. Créez un compte sur [Netlify](https://netlify.com)
2. Connectez votre dépôt Git ou glissez-déposez le dossier `dist/`
3. Configuration automatique détectée ✅

### Option 2: Vercel

1. Créez un compte sur [Vercel](https://vercel.com)
2. Importez votre projet
3. Déploiement automatique

### Option 3: GitHub Pages

```bash
npm install --save-dev gh-pages
```

Ajoutez dans `package.json`:
```json
"homepage": "https://votreusername.github.io/usratul-amine",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```

Puis: `npm run deploy`

## 📞 Support

Pour toute question technique:
- Consultez la documentation de [React](https://react.dev)
- Documentation [TailwindCSS](https://tailwindcss.com)
- Documentation [Framer Motion](https://www.framer.com/motion/)

## ✨ Conseils pour impressionner Serigne Sidy

1. **Démonstration live**: Montrez le site en direct avec les animations
2. **Responsive**: Montrez que ça marche sur téléphone
3. **Navigation fluide**: Cliquez sur les menus pour montrer le scroll smooth
4. **Détails**: Pointez les motifs islamiques subtils et les couleurs du logo
5. **Message**: Lisez le message du coordinateur pour montrer la présentation élégante

---

Que le site honore dignement l'héritage de Serigne Abdou Aziz Sy Al Amine ! 🌙✨
