# Guide de gestion des utilisateurs

## 🎯 Vue d'ensemble

Le système de gestion des utilisateurs vous permet de créer, modifier et gérer les comptes administrateurs de votre plateforme Usratul Amine.

## 👥 Types d'utilisateurs

### **Administrateur** 🔴
- Accès complet à toutes les fonctionnalités
- Peut gérer les programmes, le calendrier Tariqa et les utilisateurs
- Peut créer, modifier et supprimer tout contenu

### **Éditeur** 🟡
- Peut gérer les programmes et le calendrier Tariqa
- Ne peut pas gérer les utilisateurs
- Accès en lecture/écriture au contenu

### **Lecteur** 🟢
- Accès en lecture seule
- Peut consulter les données mais pas les modifier
- Utile pour les comptes de consultation

## ✨ Fonctionnalités

### 1. **Créer un utilisateur**

1. Cliquez sur **"Ajouter un utilisateur"**
2. Remplissez le formulaire :
   - **Nom complet** : Nom de l'utilisateur
   - **Email** : Adresse email (sera l'identifiant de connexion)
   - **Mot de passe** : Minimum 6 caractères
   - **Rôle** : Administrateur, Éditeur ou Lecteur
3. Cliquez sur **"Créer l'utilisateur"**

**Note** : L'utilisateur recevra ses identifiants et pourra se connecter immédiatement.

### 2. **Modifier un utilisateur**

1. Cliquez sur l'icône **crayon bleu** (✏️) à côté de l'utilisateur
2. Modifiez les informations :
   - Nom complet
   - Rôle
   - ⚠️ L'email ne peut pas être modifié
3. Cliquez sur **"Mettre à jour"**

### 3. **Activer/Désactiver un utilisateur**

1. Cliquez sur l'icône **utilisateur** (👤) à côté de l'utilisateur
2. L'utilisateur sera désactivé/activé
3. Un utilisateur désactivé ne peut plus se connecter

**Avantages** :
- Pas besoin de supprimer le compte
- Peut être réactivé à tout moment
- Conserve l'historique

### 4. **Supprimer un utilisateur**

1. Cliquez sur l'icône **poubelle rouge** (🗑️)
2. Confirmez la suppression dans la modale
3. L'utilisateur sera définitivement supprimé

⚠️ **Attention** : Cette action est irréversible !

## 🔐 Sécurité

### **Bonnes pratiques**

1. **Mots de passe forts**
   - Minimum 8 caractères
   - Mélange de lettres, chiffres et symboles
   - Éviter les mots de passe évidents

2. **Principe du moindre privilège**
   - Donnez uniquement les permissions nécessaires
   - Utilisez le rôle "Lecteur" pour les consultations
   - Limitez le nombre d'administrateurs

3. **Gestion des accès**
   - Désactivez les comptes inactifs
   - Supprimez les comptes des anciens membres
   - Vérifiez régulièrement la liste des utilisateurs

4. **Emails professionnels**
   - Utilisez des emails officiels (@usratul-amine.com)
   - Évitez les emails personnels
   - Facilitez l'identification

## 📊 Informations affichées

Pour chaque utilisateur, vous voyez :
- **Nom complet**
- **Email**
- **Rôle** (badge coloré)
- **Statut** (Actif/Désactivé)
- **Date de création**

## 🎨 Codes couleurs

- 🟣 **Violet** : Administrateur
- 🔵 **Bleu** : Éditeur
- ⚪ **Gris** : Lecteur
- 🔴 **Rouge** : Désactivé

## ⚠️ Limitations

### **Email non modifiable**
Une fois un utilisateur créé, son email ne peut pas être changé. Si nécessaire :
1. Créez un nouveau compte avec le bon email
2. Supprimez l'ancien compte

### **Mot de passe**
- Le mot de passe ne peut être modifié que par l'utilisateur lui-même
- Pour réinitialiser : l'utilisateur doit utiliser "Mot de passe oublié"

### **Auto-suppression**
- Vous ne pouvez pas supprimer votre propre compte
- Un autre administrateur doit le faire

## 🔄 Workflow recommandé

### **Nouvel administrateur**
1. Créer le compte avec rôle "Éditeur"
2. Vérifier qu'il peut se connecter
3. Former l'utilisateur
4. Passer en "Administrateur" si nécessaire

### **Départ d'un membre**
1. Désactiver le compte immédiatement
2. Vérifier qu'il n'a plus accès
3. Après 30 jours, supprimer définitivement

### **Audit de sécurité**
1. Vérifier la liste mensuelle
2. Désactiver les comptes inactifs
3. Vérifier les rôles attribués
4. Mettre à jour si nécessaire

## 🆘 Dépannage

### **Impossible de créer un utilisateur**
- **Email déjà utilisé** : Cet email existe déjà
- **Mot de passe faible** : Utilisez au moins 6 caractères
- **Email invalide** : Vérifiez le format de l'email

### **Utilisateur ne peut pas se connecter**
1. Vérifiez que le compte est **activé**
2. Vérifiez l'email et le mot de passe
3. Vérifiez que Firebase Auth est activé

### **Erreur de permission**
- Vérifiez les règles Firestore
- Assurez-vous que la collection `users` est accessible

## 📞 Support

Pour toute question sur la gestion des utilisateurs, contactez l'administrateur technique principal.

---

**Développé avec ❤️ pour Usratul Amine**
