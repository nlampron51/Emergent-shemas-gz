// Mock data for ICD201 Course Schema
export const mockUnits = [
  {
    id: 1,
    title: "Fondements des technologies numériques",
    duration: 25,
    description: "Introduction aux concepts de base des technologies numériques et leur impact sur la société moderne",
    objectives: [
      "Comprendre l'évolution des technologies numériques",
      "Identifier les composants matériels et logiciels",
      "Analyser l'impact social des innovations technologiques"
    ],
    lessons: [
      {
        id: 101,
        title: "Histoire des technologies numériques",
        duration: 3,
        resources: ["ordinateurs", "iPad"],
        activities: ["Recherche collaborative", "Présentation multimédia"],
        content: "Explorer l'évolution des ordinateurs depuis les années 1940 jusqu'aux technologies actuelles"
      },
      {
        id: 102,
        title: "Architecture des systèmes informatiques",
        duration: 4,
        resources: ["ordinateurs"],
        activities: ["Démontage/remontage PC", "Diagrammes techniques"],
        content: "Comprendre les composants matériels : CPU, RAM, stockage, périphériques"
      },
      {
        id: 103,
        title: "Systèmes d'exploitation et logiciels",
        duration: 3,
        resources: ["ordinateurs", "iPad"],
        activities: ["Installation logiciels", "Comparaison OS"],
        content: "Analyser les différents systèmes d'exploitation et leur utilisation"
      }
    ]
  },
  {
    id: 2,
    title: "Innovation et conception numérique",
    duration: 30,
    description: "Développement de compétences en conception et innovation utilisant les outils numériques",
    objectives: [
      "Maîtriser les outils de conception assistée par ordinateur",
      "Développer la pensée créative et innovante",
      "Créer des prototypes numériques et physiques"
    ],
    lessons: [
      {
        id: 201,
        title: "Conception assistée par ordinateur (CAO)",
        duration: 8,
        resources: ["ordinateurs", "imprimantes3D"],
        activities: ["Modélisation 3D", "Création de prototypes"],
        content: "Utiliser des logiciels de CAO pour créer des modèles 3D complexes"
      },
      {
        id: 202,
        title: "Impression 3D et fabrication numérique",
        duration: 10,
        resources: ["imprimantes3D", "ordinateurs"],
        activities: ["Impression d'objets", "Post-traitement"],
        content: "Maîtriser le processus complet de l'impression 3D"
      },
      {
        id: 203,
        title: "Design thinking et innovation",
        duration: 6,
        resources: ["iPad", "ordinateurs"],
        activities: ["Brainstorming numérique", "Prototypage rapide"],
        content: "Appliquer la méthodologie du design thinking à des projets technologiques"
      }
    ]
  },
  {
    id: 3,
    title: "Médias numériques et communication",
    duration: 30,
    description: "Création et gestion de contenu multimédia à l'aide d'outils numériques avancés",
    objectives: [
      "Créer du contenu multimédia de qualité professionnelle",
      "Comprendre les principes de communication numérique",
      "Maîtriser les outils d'édition audio et vidéo"
    ],
    lessons: [
      {
        id: 301,
        title: "Production audio numérique",
        duration: 8,
        resources: ["dispositifsAudioUSB", "ordinateurs"],
        activities: ["Enregistrement podcast", "Montage audio"],
        content: "Techniques d'enregistrement et de post-production audio"
      },
      {
        id: 302,
        title: "Création vidéo et montage",
        duration: 10,
        resources: ["ordinateurs", "iPad", "dispositifsAudioUSB"],
        activities: ["Production vidéo", "Effets spéciaux"],
        content: "Réalisation complète de projets vidéo professionnels"
      },
      {
        id: 303,
        title: "Communication numérique et réseaux sociaux",
        duration: 6,
        resources: ["iPad", "ordinateurs"],
        activities: ["Campagne marketing", "Analyse d'audience"],
        content: "Stratégies de communication à l'ère numérique"
      }
    ]
  },
  {
    id: 4,
    title: "Projet intégrateur et évaluation",
    duration: 25,
    description: "Synthèse des apprentissages à travers un projet technologique complet",
    objectives: [
      "Intégrer toutes les compétences acquises",
      "Gérer un projet technologique de A à Z",
      "Présenter et défendre son travail"
    ],
    lessons: [
      {
        id: 401,
        title: "Planification et gestion de projet",
        duration: 4,
        resources: ["ordinateurs", "iPad"],
        activities: ["Cahier des charges", "Planning projet"],
        content: "Méthodologies de gestion de projet en technologie"
      },
      {
        id: 402,
        title: "Développement du projet final",
        duration: 15,
        resources: ["ordinateurs", "iPad", "imprimantes3D", "dispositifsAudioUSB"],
        activities: ["Développement", "Tests", "Itérations"],
        content: "Réalisation d'un projet technologique innovant"
      },
      {
        id: 403,
        title: "Présentation et évaluation",
        duration: 6,
        resources: ["ordinateurs", "dispositifsAudioUSB"],
        activities: ["Présentation orale", "Démonstration technique"],
        content: "Présentation professionnelle du projet réalisé"
      }
    ]
  }
];

export const mockResources = [
  {
    id: "ordinateurs",
    name: "Ordinateurs",
    quantity: 30,
    description: "Postes de travail informatique complets",
    availability: "Disponible en permanence"
  },
  {
    id: "iPad",
    name: "iPad",
    quantity: 15,
    description: "Tablettes pour travail mobile et créatif",
    availability: "Réservation requise"
  },
  {
    id: "imprimantes3D",
    name: "Imprimantes 3D",
    quantity: 3,
    description: "Imprimantes 3D pour prototypage",
    availability: "Planning d'utilisation"
  },
  {
    id: "dispositifsAudioUSB",
    name: "Dispositifs Audio USB",
    quantity: 10,
    description: "Microphones et interfaces audio USB",
    availability: "Disponible sur demande"
  }
];

export const mockSchedule = {
  totalHours: 110,
  totalWeeks: 18,
  hoursPerWeek: 6.1,
  startDate: "2025-01-15",
  endDate: "2025-05-30"
};

export const mockCalendarEvents = [
  {
    id: 1,
    title: "Introduction aux technologies numériques",
    unitId: 1,
    lessonId: 101,
    date: "2025-01-15",
    duration: 3,
    resources: ["ordinateurs", "iPad"]
  },
  {
    id: 2,
    title: "Architecture des systèmes",
    unitId: 1,
    lessonId: 102,
    date: "2025-01-22",
    duration: 4,
    resources: ["ordinateurs"]
  },
  {
    id: 3,
    title: "Conception 3D - Projet 1",
    unitId: 2,
    lessonId: 201,
    date: "2025-02-12",
    duration: 8,
    resources: ["ordinateurs", "imprimantes3D"]
  }
];