# 🚀 Déploiement GitHub - One Click

## 🎯 La Méthode la Plus Simple

### Étape 1: Créer le Projet + GitHub en Une Fois

```bash
# Télécharger ce script et l'exécuter
curl -O https://raw.githubusercontent.com/username/script/main/create-icd201.sh
chmod +x create-icd201.sh
./create-icd201.sh
```

### Étape 2: Ou Manuellement (5 minutes)

```bash
# 1. Créer le projet
npx create-react-app icd201-schema
cd icd201-schema

# 2. Initialiser Git
git init
git add .
git commit -m "Initial commit"

# 3. Créer le repository GitHub (via browser)
# - Aller sur github.com
# - New repository → icd201-schema
# - Copier l'URL

# 4. Connecter et pousser
git remote add origin https://github.com/VOTRE-USERNAME/icd201-schema.git
git branch -M main
git push -u origin main
```

## 🎊 Résultat Final

Votre repository GitHub contiendra :
- ✅ **Code source complet** 
- ✅ **Instructions d'installation**
- ✅ **Documentation détaillée**
- ✅ **Prêt à cloner et utiliser**

## 🌐 Partage Easy

Une fois sur GitHub, n'importe qui peut :
```bash
git clone https://github.com/VOTRE-USERNAME/icd201-schema.git
cd icd201-schema
npm install
npm start
```

**🎓 Et voilà ! App ICD201 disponible mondialement !**