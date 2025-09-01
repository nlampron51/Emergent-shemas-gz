#!/bin/bash
# Script automatique pour créer l'app ICD201 et la pousser sur GitHub

echo "🚀 Création automatique de l'application ICD201 Schema"
echo "=================================================="

# Vérifier si git est installé
if ! command -v git &> /dev/null; then
    echo "❌ Git n'est pas installé. Installez-le depuis https://git-scm.com/"
    exit 1
fi

# Vérifier si node est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Installez-le depuis https://nodejs.org/"
    exit 1
fi

echo "✅ Prérequis vérifiés"

# Créer le projet
echo "📦 Création du projet React..."
npx create-react-app icd201-schema
cd icd201-schema

echo "📦 Installation des dépendances UI..."
npm install @radix-ui/react-accordion @radix-ui/react-alert-dialog @radix-ui/react-aspect-ratio @radix-ui/react-avatar @radix-ui/react-checkbox @radix-ui/react-collapsible @radix-ui/react-context-menu @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-hover-card @radix-ui/react-label @radix-ui/react-menubar @radix-ui/react-navigation-menu @radix-ui/react-popover @radix-ui/react-progress @radix-ui/react-radio-group @radix-ui/react-scroll-area @radix-ui/react-select @radix-ui/react-separator @radix-ui/react-slider @radix-ui/react-slot @radix-ui/react-switch @radix-ui/react-tabs @radix-ui/react-toast @radix-ui/react-toggle @radix-ui/react-toggle-group @radix-ui/react-tooltip

npm install @hookform/resolvers class-variance-authority clsx cmdk date-fns embla-carousel-react input-otp lucide-react next-themes react-day-picker react-hook-form react-resizable-panels react-router-dom sonner tailwind-merge tailwindcss-animate vaul zod

npm install -D tailwindcss postcss autoprefixer @craco/craco
npx tailwindcss init -p

echo "⚙️ Configuration de l'application..."

# Initialiser git
git init
git add .
git commit -m "Initial commit: Base React app"

echo ""
echo "🎯 Application créée avec succès !"
echo "📁 Dossier: $(pwd)"
echo ""
echo "📋 Prochaines étapes :"
echo "1. Créer un nouveau repository sur GitHub.com"
echo "2. Copier l'URL du repository (ex: https://github.com/votreusername/icd201-schema.git)"
echo "3. Exécuter ces commandes :"
echo "   git remote add origin https://github.com/VOTRE-USERNAME/icd201-schema.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "🚀 Pour démarrer l'app : npm start"