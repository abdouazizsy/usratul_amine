# 📸 Comment ajouter vos images au site

## Étape 1: Localiser le dossier public

Le dossier `public` se trouve ici:
```
/Users/abdouazizsyndiaye/CascadeProjects/usratul-amine/public/
```

## Étape 2: Copier les images

Vous devez copier **2 images** dans ce dossier:

### Image 1: Le Logo
- **Nom du fichier**: `logo-og-v2.png` (ou `logo-og-v2.png`)
- **Image**: Le logo avec le dôme et les branches d'olivier (première image que vous avez envoyée)
- **Emplacement final**: `/Users/abdouazizsyndiaye/CascadeProjects/usratul-amine/public/logo-og-v2.png`
- **Note**: Le logo est maintenant affiché avec un fond blanc circulaire pour une meilleure visibilité

### Image 2: Photo de Serigne Al Amine
- **Nom du fichier**: `serigne-al-amine.jpg`
- **Image**: La photo de Serigne Abdou Aziz Sy Al Amine (deuxième image que vous avez envoyée)
- **Emplacement final**: `/Users/abdouazizsyndiaye/CascadeProjects/usratul-amine/public/serigne-al-amine.jpg`

## Étape 3: Méthode simple par le Finder (Mac)

1. Ouvrez le **Finder**
2. Allez dans: **CascadeProjects** → **usratul-amine** → **public**
3. Glissez-déposez les 2 images dans ce dossier
4. Renommez-les:
   - Logo → `logo-og-v2.png`
   - Photo → `serigne-al-amine.jpg`

## Étape 4: Vérification

Une fois les images copiées, le site les affichera automatiquement:
- ✅ Le **logo** apparaîtra dans la **navbar** en haut
- ✅ Le **logo** apparaîtra dans la **section Hero** (page d'accueil)
- ✅ La **photo** apparaîtra dans la **section Biographie**

**Note**: Si le serveur est déjà en cours d'exécution (`npm run dev`), rechargez simplement la page dans votre navigateur pour voir les images !

## Alternative: Via Terminal

Si vous préférez utiliser le terminal:

```bash
# Aller dans le dossier public
cd /Users/abdouazizsyndiaye/CascadeProjects/usratul-amine/public/

# Copier vos images (adaptez les chemins selon où se trouvent vos images)
cp /chemin/vers/votre/logo-og-v2.png ./logo-og-v2.png
cp /chemin/vers/votre/photo.jpg ./serigne-al-amine.jpg
```

## 🎉 C'est tout !

Le site utilisera automatiquement ces images. Si une image n'est pas trouvée, un placeholder s'affichera à la place.

---

**Astuce**: Pour de meilleures performances:
- Le logo devrait être en format **PNG** avec fond transparent
- La photo peut être en **JPG** ou **PNG**
- Taille recommandée pour le logo: 500x500 pixels minimum
- Taille recommandée pour la photo: 800x1200 pixels minimum
