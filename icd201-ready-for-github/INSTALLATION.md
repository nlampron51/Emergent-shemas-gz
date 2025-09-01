# 🚀 Guide d'Installation - Schéma de Cours ICD201

Ce guide vous accompagne pas à pas pour installer et utiliser l'application localement sur votre ordinateur.

## 📋 Prérequis

### Logiciels requis
1. **Node.js** (version 16 ou supérieure)
   - 💻 **Windows/Mac:** Téléchargez depuis [nodejs.org](https://nodejs.org/)
   - 🐧 **Linux:** `sudo apt install nodejs npm` ou `sudo yum install nodejs npm`

2. **Vérifier l'installation**
   ```bash
   node --version    # Doit afficher v16.0.0 ou plus récent
   npm --version     # Doit afficher 8.0.0 ou plus récent
   ```

## 📁 Étapes d'Installation

### Option 1: Téléchargement du projet complet

1. **Télécharger et extraire**
   ```bash
   # Si vous avez reçu un fichier ZIP
   # Extraire dans le dossier de votre choix
   # Exemple: C:\Users\VotreNom\Documents\ICD201-Schema
   ```

2. **Naviguer vers le dossier**
   ```bash
   cd chemin/vers/icd201-course-schema
   ```

### Option 2: Création manuelle du projet

1. **Créer un nouveau projet React**
   ```bash
   npx create-react-app icd201-course-schema
   cd icd201-course-schema
   ```

2. **Installer les dépendances supplémentaires**
   ```bash
   npm install @hookform/resolvers @radix-ui/react-accordion @radix-ui/react-alert-dialog @radix-ui/react-aspect-ratio @radix-ui/react-avatar @radix-ui/react-checkbox @radix-ui/react-collapsible @radix-ui/react-context-menu @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-hover-card @radix-ui/react-label @radix-ui/react-menubar @radix-ui/react-navigation-menu @radix-ui/react-popover @radix-ui/react-progress @radix-ui/react-radio-group @radix-ui/react-scroll-area @radix-ui/react-select @radix-ui/react-separator @radix-ui/react-slider @radix-ui/react-slot @radix-ui/react-switch @radix-ui/react-tabs @radix-ui/react-toast @radix-ui/react-toggle @radix-ui/react-toggle-group @radix-ui/react-tooltip class-variance-authority clsx cmdk date-fns embla-carousel-react input-otp lucide-react next-themes react-day-picker react-hook-form react-resizable-panels react-router-dom sonner tailwind-merge tailwindcss-animate vaul zod
   ```

3. **Installer Tailwind CSS**
   ```bash
   npm install -D tailwindcss postcss autoprefixer @craco/craco
   npx tailwindcss init -p
   ```

## 🛠️ Configuration

### 1. Installer les dépendances
```bash
npm install
# ou si vous préférez yarn
yarn install
```

### 2. Démarrer l'application
```bash
npm start
# ou 
yarn start
```

### 3. Ouvrir dans le navigateur
L'application s'ouvrira automatiquement sur `http://localhost:3000`

Si ce n'est pas le cas, ouvrez manuellement cette URL dans votre navigateur.

## 🔧 Dépannage

### Problèmes courants

#### ❌ **Erreur: "node" n'est pas reconnu**
**Solution:** Node.js n'est pas installé ou pas dans le PATH
```bash
# Vérifier l'installation
where node    # Windows
which node    # Mac/Linux

# Réinstaller Node.js si nécessaire
```

#### ❌ **Port 3000 déjà utilisé**
**Solution:** Utiliser un autre port
```bash
# Windows
set PORT=3001 && npm start

# Mac/Linux
PORT=3001 npm start
```

#### ❌ **Erreurs de dépendances**
**Solution:** Nettoyer et réinstaller
```bash
# Supprimer les modules existants
rm -rf node_modules package-lock.json

# Réinstaller
npm install

# Ou forcer la résolution des conflits
npm install --legacy-peer-deps
```

#### ❌ **L'application ne s'affiche pas correctement**
**Solutions:**
1. Vider le cache du navigateur (Ctrl+Shift+R)
2. Essayer un autre navigateur
3. Vérifier la console développeur (F12)

## 📱 Compatibilité

### Navigateurs supportés
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Systèmes d'exploitation
- ✅ Windows 10/11
- ✅ macOS 10.15+
- ✅ Ubuntu 20.04+
- ✅ Autres distributions Linux récentes

## 🎯 Utilisation

### Navigation principale
- **Dashboard:** Vue d'ensemble du cours avec 4 unités
- **Éditeur d'unités:** Modification des contenus et leçons
- **Gestion des ressources:** Administration des équipements
- **Calendrier:** Planification sur 18 semaines
- **Export PDF:** Génération de documents (simulation)

### Fonctionnalités interactives
- ✏️ Modification en temps réel des unités
- ➕ Ajout/suppression de leçons
- 📊 Statistiques d'utilisation des ressources
- 📅 Planification calendaire
- 📄 Options d'export personnalisables

## 💾 Données

### Stockage local
L'application fonctionne entièrement en local avec des données de démonstration.
Les modifications sont temporaires et ne persistent pas entre les sessions.

### Données pré-configurées
- 4 unités de cours ICD201
- Ressources: Ordinateurs, iPad, Imprimantes 3D, Dispositifs Audio
- Calendrier sur 18 semaines (110 heures total)

## 🔄 Mise à jour

### Mettre à jour les dépendances
```bash
npm update
```

### Vérifier les vulnérabilités
```bash
npm audit
npm audit fix
```

## 📝 Personnalisation

### Modifier le contenu
Éditez `/src/data/mockData.js` pour personnaliser:
- Les unités et descriptions
- Les ressources disponibles
- Les événements du calendrier

### Personnaliser l'apparence
- **Couleurs:** Modifiez `tailwind.config.js`
- **Styles:** Éditez `src/index.css`
- **Composants:** Personnalisez dans `src/components/ui/`

## 🆘 Support

### Si vous rencontrez des problèmes:

1. **Vérifiez les prérequis** (Node.js version)
2. **Consultez la section dépannage** ci-dessus
3. **Vérifiez les logs** dans la console du navigateur (F12)
4. **Redémarrez l'application**
   ```bash
   # Arrêter avec Ctrl+C puis
   npm start
   ```

## 📊 Performance

### Optimisation
- L'application est optimisée pour les appareils desktop et mobiles
- Temps de chargement: < 3 secondes sur connexion standard
- Compatible avec les écrans haute résolution

### Ressources système
- **RAM:** 512 MB minimum recommandé
- **Stockage:** 200 MB d'espace libre
- **Processeur:** Tout processeur moderne

---

🎓 **Application développée pour le curriculum ICD201 de l'Ontario**
📧 **Support:** Consultez la documentation React pour l'aide technique
🌐 **Version:** 1.0.0 Standalone