# Schéma de Cours ICD201 - Technologies Numériques et Innovations

Application web interactive pour créer et gérer le schéma de cours ICD201 du curriculum de l'Ontario.

## 🚀 Fonctionnalités

### 📊 Dashboard Principal
- Vue d'ensemble des 4 unités de cours (110 heures sur 18 semaines)
- Progression visuelle et navigation rapide
- Accès direct à toutes les sections

### 📝 Éditeur d'Unités
- Modification complète des unités avec onglets
- Gestion des leçons (ajout/suppression/modification)
- Attribution des ressources par activité
- Objectifs d'apprentissage personnalisables

### ⚙️ Gestion des Ressources
- Inventaire complet : Ordinateurs, iPad, Imprimantes 3D, Dispositifs Audio USB
- Visualisation de l'utilisation par unité/leçon
- Planning d'utilisation avec détection des conflits
- Statistiques détaillées d'usage

### 📅 Calendrier Intégré
- Planification complète sur 18 semaines (janvier-mai 2025)
- Filtres par unité et ressource
- Vue chronologique avec événements
- Navigation interactive avec mini-calendrier

### 📄 Export PDF (Simulation)
- Options de niveau de détail (résumé/détaillé/personnalisé)
- Sélection des sections à inclure
- Aperçu en temps réel du document
- Configuration flexible du contenu

## 🛠️ Installation

### Prérequis
- Node.js (version 16 ou supérieure)
- npm ou yarn

### Étapes d'installation

1. **Cloner ou télécharger le projet**
   ```bash
   # Si vous avez git
   git clone [url-du-projet]
   cd icd201-course-schema
   
   # Ou extraire le fichier ZIP téléchargé
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Démarrer l'application**
   ```bash
   npm start
   # ou
   yarn start
   ```

4. **Ouvrir dans le navigateur**
   - L'application s'ouvrira automatiquement sur `http://localhost:3000`
   - Si ce n'est pas le cas, ouvrez manuellement cette URL

## 📁 Structure du Projet

```
icd201-course-schema/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── ui/              # Composants UI (Shadcn/UI)
│   │   ├── Dashboard.jsx    # Page d'accueil
│   │   ├── UnitEditor.jsx   # Éditeur d'unités
│   │   ├── ResourceManager.jsx # Gestion des ressources
│   │   ├── Calendar.jsx     # Calendrier
│   │   └── PDFExport.jsx    # Export PDF
│   ├── hooks/
│   │   └── use-toast.js     # Hook pour notifications
│   ├── data/
│   │   └── mockData.js      # Données de démonstration
│   ├── App.js               # Composant principal
│   ├── App.css             # Styles de base
│   └── index.js            # Point d'entrée
├── package.json
├── tailwind.config.js
└── README.md
```

## 🎨 Design et Technologies

- **Framework:** React 19
- **Styling:** Tailwind CSS + Shadcn/UI
- **Routing:** React Router DOM
- **Icons:** Lucide React
- **Notifications:** Sonner Toast
- **Forms:** React Hook Form + Zod

## 📚 Contenu Pré-configuré

L'application inclut un schéma de cours complet pour ICD201 :

### Unité 1: Fondements des technologies numériques (25h)
- Histoire des technologies numériques
- Architecture des systèmes informatiques
- Systèmes d'exploitation et logiciels

### Unité 2: Innovation et conception numérique (30h)
- Conception assistée par ordinateur (CAO)
- Impression 3D et fabrication numérique
- Design thinking et innovation

### Unité 3: Médias numériques et communication (30h)
- Production audio numérique
- Création vidéo et montage
- Communication numérique et réseaux sociaux

### Unité 4: Projet intégrateur et évaluation (25h)
- Planification et gestion de projet
- Développement du projet final
- Présentation et évaluation

## 🔧 Personnalisation

### Modifier le contenu des cours
Éditez le fichier `src/data/mockData.js` pour personnaliser :
- Les unités et leurs descriptions
- Les leçons et objectifs
- Les ressources disponibles
- Le calendrier des activités

### Personnaliser l'apparence
- Modifiez `tailwind.config.js` pour les couleurs et thèmes
- Éditez les composants dans `src/components/ui/` pour l'interface
- Ajustez `src/App.css` pour les styles personnalisés

## 📱 Compatibilité

- **Navigateurs:** Chrome, Firefox, Safari, Edge (versions récentes)
- **Appareils:** Desktop, tablette, mobile (responsive)
- **OS:** Windows, macOS, Linux

## 🆘 Dépannage

### L'application ne démarre pas
```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
npm start
```

### Erreurs de dépendances
```bash
# Forcer la résolution des conflits
npm install --legacy-peer-deps
```

### Port 3000 déjà utilisé
```bash
# Utiliser un autre port
PORT=3001 npm start
```

## 📧 Support

Pour toute question ou problème :
1. Vérifiez la section dépannage ci-dessus
2. Consultez la documentation React : https://react.dev
3. Vérifiez les issues sur le repository du projet

## 📝 License

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

---

Développé pour le curriculum ICD201 de l'Ontario - Technologies numériques et innovations dans un monde en évolution.