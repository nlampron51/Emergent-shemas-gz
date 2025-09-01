# 🍎 Setup MacBook - ICD201 Schema App

## 🎯 Pour nlampron51 - Instructions MacBook

### ÉTAPE 1: Prérequis MacBook
```bash
# Ouvrir Terminal (Cmd + Espace, taper "Terminal")

# Vérifier Node.js
node --version
npm --version

# Si pas installé:
# 1. Aller sur https://nodejs.org/
# 2. Télécharger "LTS" (version recommandée)
# 3. Installer le .pkg
# 4. Redémarrer Terminal
```

### ÉTAPE 2: Créer Repository GitHub
1. **Aller sur** https://github.com/nlampron51
2. **Cliquer** "New repository" (bouton vert)
3. **Remplir:**
   - Repository name: `icd201-schema-app`
   - Description: `Application ICD201 - Schéma de cours interactif`
   - ✅ Public
   - ✅ Add a README file
4. **Cliquer** "Create repository"

### ÉTAPE 3: Setup Local MacBook
```bash
# Dans Terminal, choisir un dossier
cd ~/Desktop        # Bureau
# ou
cd ~/Documents      # Documents

# Cloner votre nouveau repository
git clone https://github.com/nlampron51/icd201-schema-app.git
cd icd201-schema-app
```

### ÉTAPE 4: Récupérer les Fichiers de l'App

**Vous avez 2 options:**

#### Option A: Télécharger l'archive
1. Récupérer le fichier `icd201-nlampron51-ready.tar.gz`
2. Double-clic pour extraire sur MacBook
3. Copier TOUT le contenu dans votre dossier `icd201-schema-app`

#### Option B: Script automatique
```bash
# Télécharger et exécuter le script
curl -O [URL-DU-SERVEUR]/auto-deploy-nlampron51.sh
chmod +x auto-deploy-nlampron51.sh
./auto-deploy-nlampron51.sh
```

### ÉTAPE 5: Installation et Test
```bash
# Dans le dossier icd201-schema-app
npm install          # Installation des dépendances (2-3 min)
npm start           # Lancer l'app
```

**✅ L'application s'ouvre sur http://localhost:3000**

### ÉTAPE 6: Créer la Branche et Push
```bash
# Créer la branche demandée
git checkout -b icd201-app-v1

# Ajouter tous les fichiers
git add .
git commit -m "Application ICD201 complète - Toutes fonctionnalités"

# Pousser vers GitHub
git push -u origin icd201-app-v1

# Aussi sur main pour avoir partout
git checkout main
git merge icd201-app-v1
git push origin main
```

## 🎊 Résultat Final

**Repository GitHub:** https://github.com/nlampron51/icd201-schema-app

**Branches disponibles:**
- `main` - Version principale
- `icd201-app-v1` - Branche demandée avec l'app complète

## 🔄 Utilisation Future

**Pour vous ou d'autres personnes:**
```bash
git clone https://github.com/nlampron51/icd201-schema-app.git
cd icd201-schema-app
npm install
npm start
```

**✅ L'app ICD201 fonctionne parfaitement en local !**

## 🎯 Fonctionnalités Incluses

- 📊 Dashboard avec 4 unités ICD201
- ✏️ Éditeur d'unités interactif
- ⚙️ Gestion ressources (iPad, PC, Imprimantes 3D, Audio)
- 📅 Calendrier 18 semaines (110 heures)
- 📄 Export PDF personnalisable
- 🎨 Interface moderne responsive

**🎓 Prêt pour l'enseignement du curriculum ICD201 de l'Ontario !**