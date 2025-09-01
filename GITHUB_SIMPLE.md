# 📁 Mise sur GitHub - Guide Ultra Simple

## 🎯 Étapes pour mettre votre app sur GitHub

### ÉTAPE 1: Créer l'application (localement d'abord)
```bash
# Suivre le guide précédent pour créer l'app
# OU utiliser le script automatique
```

### ÉTAPE 2: Préparer GitHub
1. Aller sur **https://github.com**
2. Se connecter à votre compte
3. Cliquer **"New repository"** (bouton vert)
4. Nommer le repository : `icd201-schema`
5. **Laisser "Public"** coché
6. **NE PAS** cocher "Add a README file"
7. Cliquer **"Create repository"**

### ÉTAPE 3: Connecter local → GitHub
```bash
# Dans le terminal, dans votre dossier icd201-schema
git remote add origin https://github.com/VOTRE-USERNAME/icd201-schema.git
git branch -M main
git add .
git commit -m "Application ICD201 Schema complète"
git push -u origin main
```

### ÉTAPE 4: Vérifier
1. Rafraîchir la page GitHub
2. Vous devriez voir tous vos fichiers !

## 🎊 Alternative : GitHub Desktop (Plus facile)

### Si vous préférez une interface graphique :
1. Télécharger **GitHub Desktop** : https://desktop.github.com/
2. Se connecter à GitHub
3. Cliquer **"Add an Existing Repository"**
4. Sélectionner votre dossier `icd201-schema`
5. Cliquer **"Publish repository"**
6. Choisir le nom et cliquer **"Publish"**

**✅ C'est tout ! Votre app sera sur GitHub !**