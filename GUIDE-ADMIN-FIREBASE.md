# Guide d'utilisation - Interface Admin avec Firebase

## 🎯 Vue d'ensemble

Votre site Usratul Amine dispose maintenant d'une interface admin complète avec Firebase pour gérer dynamiquement les programmes et événements.

## ✨ Fonctionnalités principales

### 1. **Gestion des programmes Usratul Amine**
- Ajouter, modifier et supprimer des programmes
- Détection automatique des conflits avec le calendrier de la Tariqa
- Affichage dynamique sur le site public
- Tri automatique : programmes à venir / passés

### 2. **Calendrier de la Tariqa (COSKAS 2025-2026)**
- Importation automatique de 50+ événements officiels
- Visualisation des événements de la Hadara
- Détection de conflits lors de l'ajout de programmes Usratul Amine

### 3. **Système d'alerte de conflits**
- ✅ Alerte verte : aucun conflit détecté
- ⚠️ Alerte jaune : conflit avec un événement de la Tariqa

## 🚀 Comment utiliser l'interface admin

### Accès à l'interface admin
1. Allez sur `http://localhost:5174/admin` (ou votre URL de production)
2. Connectez-vous avec : `admin@usratul-amine.com`
3. Utilisez le mot de passe que vous avez créé dans Firebase

### Importer le calendrier de la Tariqa
1. Cliquez sur l'onglet **"Calendrier Tariqa"**
2. Cliquez sur **"Importer le calendrier COSKAS"**
3. Confirmez l'importation
4. 50+ événements seront automatiquement ajoutés

### Ajouter un programme Usratul Amine
1. Cliquez sur l'onglet **"Programmes"**
2. Cliquez sur **"+ Ajouter un programme"**
3. Remplissez le formulaire :
   - **Titre** : Nom de l'événement
   - **Date** : Sélectionnez la date
   - **Heure** : Format libre (ex: 14h00)
   - **Lieu** : Localisation de l'événement
   - **Description** : Détails de l'événement
   - **Participants** : Qui peut participer (optionnel)
4. **Vérifiez l'alerte de conflit** :
   - Si alerte verte ✅ : Aucun conflit, vous pouvez enregistrer
   - Si alerte jaune ⚠️ : Un événement de la Tariqa est prévu le même jour
5. Cliquez sur **"Enregistrer"**

### Modifier un programme
1. Trouvez le programme dans la liste
2. Cliquez sur l'icône **crayon bleu** (✏️)
3. Modifiez les informations
4. Cliquez sur **"Mettre à jour"**

### Supprimer un programme
1. Trouvez le programme dans la liste
2. Cliquez sur l'icône **poubelle rouge** (🗑️)
3. Confirmez la suppression

## 📊 Structure des données Firebase

### Collection `programs` (Programmes Usratul Amine)
```javascript
{
  title: "Cérémonie du Gamou 2026",
  date: "2026-05-15",
  time: "14h00",
  location: "Grande Mosquée de Tivaouane",
  description: "Grande cérémonie annuelle...",
  participants: "Tous",
  createdAt: Timestamp
}
```

### Collection `tariqa_events` (Événements de la Tariqa)
```javascript
{
  title: "Gamou Serigne Abdou Aziz SY (RTA) «ABRAR»",
  date: "2026-01-17",
  location: "Tivaouane",
  category: "COSKAS",
  description: "Événement officiel de la Hadara",
  importedAt: Timestamp
}
```

## 🎨 Affichage public

Les programmes apparaissent automatiquement sur la page d'accueil dans la section "Programme" :
- **Programmes à venir** : Affichés en premier avec bordure verte
- **Programmes passés** : Affichés dans une section "Archives"
- **Tri automatique** : Par date croissante pour les futurs, décroissante pour les passés

## 🔐 Sécurité

- Authentification Firebase requise pour accéder à l'admin
- Seul l'email `admin@usratul-amine.com` a accès
- Les données sont stockées dans Firestore avec règles de sécurité

## 📝 Bonnes pratiques

1. **Toujours vérifier les conflits** avant d'ajouter un programme
2. **Importer le calendrier COSKAS** dès la première utilisation
3. **Mettre à jour régulièrement** les programmes passés
4. **Utiliser des descriptions claires** pour faciliter la compréhension

## 🆘 Dépannage

### Le calendrier COSKAS ne s'importe pas
- Vérifiez que Firestore est activé dans Firebase
- Vérifiez les règles de sécurité Firestore

### Les programmes n'apparaissent pas sur le site
- Vérifiez que la date est au bon format (YYYY-MM-DD)
- Actualisez la page (F5)
- Vérifiez la console du navigateur pour les erreurs

### Impossible de se connecter
- Vérifiez que l'utilisateur admin existe dans Firebase Authentication
- Vérifiez que l'email est exactement `admin@usratul-amine.com`

## 📞 Support

Pour toute question ou problème, contactez l'administrateur technique du projet.

---

**Développé avec ❤️ pour Usratul Amine**
