# Contracts API - Schéma de Cours ICD201

## Vue d'ensemble
Backend pour application de gestion de schéma de cours ICD201 avec MongoDB, FastAPI et fonctionnalités d'export PDF.

## 1. Modèles de données MongoDB

### Collection: `units`
```json
{
  "_id": ObjectId,
  "id": int,
  "title": string,
  "duration": int, // heures
  "description": string,
  "objectives": [string],
  "lessons": [
    {
      "id": int,
      "title": string,
      "duration": int,
      "resources": [string], // IDs des ressources
      "activities": [string],
      "content": string
    }
  ],
  "created_at": datetime,
  "updated_at": datetime
}
```

### Collection: `resources`
```json
{
  "_id": ObjectId,
  "id": string,
  "name": string,
  "quantity": int,
  "description": string,
  "availability": string,
  "created_at": datetime,
  "updated_at": datetime
}
```

### Collection: `calendar_events`
```json
{
  "_id": ObjectId,
  "id": int,
  "title": string,
  "unit_id": int,
  "lesson_id": int,
  "date": string, // ISO date
  "duration": int,
  "resources": [string],
  "created_at": datetime,
  "updated_at": datetime
}
```

### Collection: `course_settings`
```json
{
  "_id": ObjectId,
  "total_hours": int,
  "total_weeks": int,
  "hours_per_week": float,
  "start_date": string,
  "end_date": string,
  "course_title": string,
  "course_description": string,
  "created_at": datetime,
  "updated_at": datetime
}
```

## 2. API Endpoints

### Units API
- `GET /api/units` - Récupérer toutes les unités
- `GET /api/units/{unit_id}` - Récupérer une unité spécifique
- `POST /api/units` - Créer une nouvelle unité
- `PUT /api/units/{unit_id}` - Modifier une unité
- `DELETE /api/units/{unit_id}` - Supprimer une unité
- `POST /api/units/{unit_id}/lessons` - Ajouter une leçon à une unité
- `PUT /api/units/{unit_id}/lessons/{lesson_id}` - Modifier une leçon
- `DELETE /api/units/{unit_id}/lessons/{lesson_id}` - Supprimer une leçon

### Resources API
- `GET /api/resources` - Récupérer toutes les ressources
- `POST /api/resources` - Créer une nouvelle ressource
- `PUT /api/resources/{resource_id}` - Modifier une ressource
- `DELETE /api/resources/{resource_id}` - Supprimer une ressource
- `GET /api/resources/{resource_id}/usage` - Statistiques d'utilisation

### Calendar API
- `GET /api/calendar/events` - Récupérer tous les événements
- `POST /api/calendar/events` - Créer un nouvel événement
- `PUT /api/calendar/events/{event_id}` - Modifier un événement
- `DELETE /api/calendar/events/{event_id}` - Supprimer un événement
- `GET /api/calendar/weeks` - Vue semaines avec événements

### Export API
- `POST /api/export/pdf` - Générer et télécharger le PDF
- `POST /api/export/preview` - Aperçu du contenu PDF

### Course Settings API
- `GET /api/settings` - Récupérer les paramètres du cours
- `PUT /api/settings` - Modifier les paramètres du cours

### AI Content Generation API
- `POST /api/ai/generate-unit` - Générer contenu d'unité automatiquement
- `POST /api/ai/generate-lesson` - Générer contenu de leçon
- `POST /api/ai/enhance-content` - Améliorer le contenu existant

## 3. Données Mock à remplacer

### Dans mock.js - à connecter au backend:
- `mockUnits` → API `/api/units`
- `mockResources` → API `/api/resources` 
- `mockCalendarEvents` → API `/api/calendar/events`
- `mockSchedule` → API `/api/settings`

## 4. Intégration Frontend-Backend

### Modifications Frontend requises:
1. **Dashboard.jsx**: Remplacer `useState(mockUnits)` par appels API
2. **UnitEditor.jsx**: Connecter aux endpoints de modification d'unités
3. **ResourceManager.jsx**: Intégrer API de gestion des ressources
4. **Calendar.jsx**: Connecter API d'événements calendrier
5. **PDFExport.jsx**: Implémenter vraie génération PDF

### Services API Frontend:
- Créer `/src/services/api.js` avec toutes les fonctions d'appel API
- Gérer les états de loading/error dans chaque composant
- Intégrer les toast notifications pour les actions

## 5. Fonctionnalités PDF

### Bibliothèque: ReportLab (Python)
- Génération PDF dynamique basée sur les données DB
- Templates personnalisables selon les options d'export
- Inclusion automatique des graphiques et tableaux
- Support multi-pages avec en-têtes/pieds de page

## 6. Intégration IA (Emergent LLM)

### Génération de contenu automatique:
- Suggestions d'objectifs d'apprentissage basées sur le titre
- Génération d'activités pédagogiques contextuelles  
- Propositions de ressources optimales par leçon
- Amélioration du contenu existant

## 7. Tests à effectuer

### Backend Testing (deep_testing_backend_v2):
- Tests CRUD complets pour toutes les collections
- Validation des contraintes de données
- Performance des requêtes complexes
- Génération PDF fonctionnelle

### Frontend Testing (auto_frontend_testing_agent):
- Navigation entre toutes les pages
- Fonctionnalités d'édition en temps réel
- Filtres et recherches
- Processus d'export PDF complet

## 8. Structure des fichiers Backend

```
backend/
├── server.py (FastAPI main)
├── models/
│   ├── unit.py
│   ├── resource.py
│   ├── calendar.py
│   └── settings.py
├── routes/
│   ├── units.py
│   ├── resources.py
│   ├── calendar.py
│   ├── export.py
│   └── ai.py
├── services/
│   ├── pdf_generator.py
│   └── ai_service.py
└── utils/
    └── database.py
```

Cette architecture garantit une séparation claire des responsabilités et une maintenance aisée du code.