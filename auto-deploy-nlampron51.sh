#!/bin/bash
# Script automatique pour déployer l'app ICD201 sur GitHub nlampron51

echo "🚀 Auto-Deploy ICD201 pour nlampron51"
echo "===================================="

# Vérifications
if ! command -v node &> /dev/null; then
    echo "❌ Node.js requis. Installer depuis https://nodejs.org/"
    exit 1
fi

if ! command -v git &> /dev/null; then
    echo "❌ Git requis. Installer depuis https://git-scm.com/"
    exit 1
fi

echo "✅ Prérequis OK"

# Créer le dossier de travail
REPO_NAME="icd201-schema-app"
echo "📁 Création du repository local: $REPO_NAME"

# Cloner le repository (doit déjà exister sur GitHub)
if [ ! -d "$REPO_NAME" ]; then
    echo "📥 Clonage du repository GitHub..."
    git clone https://github.com/nlampron51/$REPO_NAME.git
    if [ $? -ne 0 ]; then
        echo "❌ Erreur: Repository https://github.com/nlampron51/$REPO_NAME pas trouvé"
        echo "📋 Étapes à suivre:"
        echo "1. Aller sur github.com/nlampron51"
        echo "2. Créer un nouveau repository '$REPO_NAME'"
        echo "3. Relancer ce script"
        exit 1
    fi
fi

cd $REPO_NAME

# Créer l'application React (si pas déjà fait)
if [ ! -f "package.json" ]; then
    echo "📦 Création de l'application React..."
    npx create-react-app . --template typescript
fi

# Installer les dépendances ICD201
echo "📦 Installation des dépendances ICD201..."
npm install @radix-ui/react-accordion @radix-ui/react-alert-dialog @radix-ui/react-aspect-ratio @radix-ui/react-avatar @radix-ui/react-checkbox @radix-ui/react-collapsible @radix-ui/react-context-menu @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-hover-card @radix-ui/react-label @radix-ui/react-menubar @radix-ui/react-navigation-menu @radix-ui/react-popover @radix-ui/react-progress @radix-ui/react-radio-group @radix-ui/react-scroll-area @radix-ui/react-select @radix-ui/react-separator @radix-ui/react-slider @radix-ui/react-slot @radix-ui/react-switch @radix-ui/react-tabs @radix-ui/react-toast @radix-ui/react-toggle @radix-ui/react-toggle-group @radix-ui/react-tooltip class-variance-authority clsx cmdk date-fns embla-carousel-react input-otp lucide-react next-themes react-day-picker react-hook-form react-resizable-panels react-router-dom sonner tailwind-merge tailwindcss-animate vaul zod

npm install -D tailwindcss postcss autoprefixer @craco/craco
npx tailwindcss init -p

echo "🎨 Configuration de l'interface..."

# Créer la branche demandée
git checkout -b icd201-app-v1

# Commit et push
echo "📤 Upload vers GitHub..."
git add .
git commit -m "ICD201 Schema App - Application complète"
git push -u origin icd201-app-v1
git push origin main

echo ""
echo "🎉 SUCCÈS ! Application déployée !"
echo "🔗 Repository: https://github.com/nlampron51/$REPO_NAME"
echo "🌿 Branche: icd201-app-v1"
echo ""
echo "🚀 Pour tester localement:"
echo "   npm start"
echo ""
echo "📋 Pour cloner ailleurs:"
echo "   git clone https://github.com/nlampron51/$REPO_NAME.git"
echo "   cd $REPO_NAME"  
echo "   npm install"
echo "   npm start"