window.BOOK_DATA = {
  "settingOrder": [
    "Scadrial",
    "Roshar",
    "Canticle",
    "Sel",
    "Nalthis",
    "Taldain",
    "Lumar",
    "Komashi",
    "Threnody",
    "First of the Sun"
  ],
  "seriesOrder": [
    "Mistborn",
    "Stormlight Archive",
    "Elantris",
    "Standalones"
  ],
  "books": [
    {
      "id": "mistborn-final-empire",
      "title": "Mistborn: The Final Empire",
      "germanTitles": ["Kinder des Nebels"],
      "setting": "Scadrial",
      "series": "Mistborn",
      "format": "Novel",
      "arcanumUnbounded": false,
      "dependencies": []
    },
    {
      "id": "well-of-ascension",
      "title": "The Well of Ascension",
      "germanTitles": ["Krieger des Feuers"],
      "setting": "Scadrial",
      "series": "Mistborn",
      "format": "Novel",
      "arcanumUnbounded": false,
      "dependencies": [
        { "id": "mistborn-final-empire", "type": "required" }
      ]
    },
    {
      "id": "hero-of-ages",
      "title": "The Hero of Ages",
      "germanTitles": ["Held aller Zeiten"],
      "setting": "Scadrial",
      "series": "Mistborn",
      "format": "Novel",
      "arcanumUnbounded": false,
      "dependencies": [
        { "id": "well-of-ascension", "type": "required" }
      ]
    },
    {
      "id": "alloy-of-law",
      "title": "The Alloy of Law",
      "germanTitles": ["Hüter des Gesetzes"],
      "setting": "Scadrial",
      "series": "Mistborn",
      "format": "Novel",
      "arcanumUnbounded": false,
      "dependencies": [
        { "id": "hero-of-ages", "type": "required" }
      ]
    },
    {
      "id": "shadows-of-self",
      "title": "Shadows of Self",
      "germanTitles": ["Schatten über Elantel"],
      "setting": "Scadrial",
      "series": "Mistborn",
      "format": "Novel",
      "arcanumUnbounded": false,
      "dependencies": [
        { "id": "alloy-of-law", "type": "required" }
      ]
    },
    {
      "id": "bands-of-mourning",
      "title": "The Bands of Mourning",
      "germanTitles": ["Bänder der Trauer"],
      "setting": "Scadrial",
      "series": "Mistborn",
      "format": "Novel",
      "arcanumUnbounded": false,
      "dependencies": [
        { "id": "shadows-of-self", "type": "required" }
      ]
    },
    {
      "id": "lost-metal",
      "title": "The Lost Metal",
      "germanTitles": ["Metall der Götter"],
      "setting": "Scadrial",
      "series": "Mistborn",
      "format": "Novel",
      "arcanumUnbounded": false,
      "dependencies": [
        { "id": "bands-of-mourning", "type": "required" },
        { "id": "mistborn-secret-history", "type": "recommended" },
        { "id": "elantris", "type": "recommended" },
        { "id": "emperors-soul", "type": "recommended" },
        { "id": "tress-of-the-emerald-sea", "type": "recommended" }
      ]
    },
    {
      "id": "eleventh-metal",
      "title": "The Eleventh Metal",
      "germanTitles": [],
      "setting": "Scadrial",
      "series": "Mistborn",
      "format": "Short Story",
      "arcanumUnbounded": true,
      "dependencies": [
        { "id": "hero-of-ages", "type": "required" }
      ]
    },
    {
      "id": "allomancer-jak",
      "title": "Allomancer Jak and the Pits of Eltania",
      "germanTitles": [],
      "setting": "Scadrial",
      "series": "Mistborn",
      "format": "Short Story",
      "arcanumUnbounded": true,
      "dependencies": [
        { "id": "alloy-of-law", "type": "required" }
      ]
    },
    {
      "id": "mistborn-secret-history",
      "title": "Mistborn: Secret History",
      "germanTitles": [],
      "setting": "Scadrial",
      "series": "Mistborn",
      "format": "Novella",
      "arcanumUnbounded": true,
      "dependencies": [
        { "id": "bands-of-mourning", "type": "recommended" },
        { "id": "hero-of-ages", "type": "required" }
      ]
    },
    {
      "id": "way-of-kings",
      "title": "The Way of Kings",
      "germanTitles": ["Der Weg der Könige", "Der Pfad der Winde"],
      "setting": "Roshar",
      "series": "Stormlight Archive",
      "format": "Novel",
      "arcanumUnbounded": false,
      "dependencies": []
    },
    {
      "id": "words-of-radiance",
      "title": "Words of Radiance",
      "germanTitles": ["Die Worte des Lichts ", "Die Stürme des Zorns"],
      "setting": "Roshar",
      "series": "Stormlight Archive",
      "format": "Novel",
      "arcanumUnbounded": false,
      "dependencies": [
        { "id": "way-of-kings", "type": "required" },
        { "id": "warbreaker", "type": "recommended" }
      ]
    },
    {
      "id": "edgedancer",
      "title": "Edgedancer",
      "germanTitles": ["Die Tänzerin am Abgrund"],
      "setting": "Roshar",
      "series": "Stormlight Archive",
      "format": "Novella",
      "arcanumUnbounded": true,
      "dependencies": [
        { "id": "words-of-radiance", "type": "required" }
      ]
    },
    {
      "id": "oathbringer",
      "title": "Oathbringer",
      "germanTitles": ["Der Ruf der Klingen", "Die Splitter der Macht"],
      "setting": "Roshar",
      "series": "Stormlight Archive",
      "format": "Novel",
      "arcanumUnbounded": false,
      "dependencies": [
        { "id": "words-of-radiance", "type": "required" },
        { "id": "edgedancer", "type": "recommended" },
        { "id": "hero-of-ages", "type": "recommended" }
      ]
    },
    {
      "id": "dawnshard",
      "title": "Dawnshard",
      "germanTitles": ["Der Splitter der Dämmerung"],
      "setting": "Roshar",
      "series": "Stormlight Archive",
      "format": "Novella",
      "arcanumUnbounded": false,
      "dependencies": [
        { "id": "oathbringer", "type": "required" }
      ]
    },
    {
      "id": "rhythm-of-war",
      "title": "Rhythm of War",
      "germanTitles": ["Der Rhythmus des Krieges", "Der Turm der Lichter"],
      "setting": "Roshar",
      "series": "Stormlight Archive",
      "format": "Novel",
      "arcanumUnbounded": false,
      "dependencies": [
        { "id": "oathbringer", "type": "required" },
        { "id": "dawnshard", "type": "nice_to_have" },
        { "id": "mistborn-secret-history", "type": "nice_to_have" }
      ]
    },
    {
      "id": "sunlit-man",
      "title": "The Sunlit Man",
      "germanTitles": ["Das Herz der Sonne"],
      "setting": "Canticle",
      "series": "Stormlight Archive",
      "format": "Novel",
      "arcanumUnbounded": false,
      "dependencies": [
        { "id": "rhythm-of-war", "type": "recommended" },
        { "id": "dawnshard", "type": "recommended" },
        { "id": "warbreaker", "type": "recommended" },
        { "id": "shadows-for-silence", "type": "recommended" }
      ]
    },
    {
      "id": "wind-and-truth",
      "title": "Wind and Truth",
      "germanTitles": ["Winde und Wahrheit", "Der Kampf der Meister"],
      "setting": "Roshar",
      "series": "Stormlight Archive",
      "format": "Novel",
      "arcanumUnbounded": false,
      "dependencies": [
        { "id": "rhythm-of-war", "type": "required" },
        { "id": "dawnshard", "type": "recommended" },
        { "id": "sunlit-man", "type": "recommended" },
        { "id": "mistborn-secret-history", "type": "recommended" }
      ]
    },
    {
      "id": "elantris",
      "title": "Elantris",
      "germanTitles": ["Elantris"],
      "setting": "Sel",
      "series": "Elantris",
      "format": "Novel",
      "arcanumUnbounded": false,
      "dependencies": []
    },
    {
      "id": "emperors-soul",
      "title": "The Emperor's Soul",
      "germanTitles": ["Die Seele des Königs"],
      "setting": "Sel",
      "series": "Elantris",
      "format": "Novella",
      "arcanumUnbounded": true,
      "dependencies": []
    },
    {
      "id": "hope-of-elantris",
      "title": "The Hope of Elantris",
      "germanTitles": [],
      "setting": "Sel",
      "series": "Elantris",
      "format": "Short Story",
      "arcanumUnbounded": true,
      "dependencies": [
        { "id": "elantris", "type": "required" }
      ]
    },
    {
      "id": "warbreaker",
      "title": "Warbreaker",
      "germanTitles": ["Sturmklänge"],
      "setting": "Nalthis",
      "series": "Standalones",
      "format": "Novel",
      "arcanumUnbounded": false,
      "dependencies": []
    },
    {
      "id": "white-sand",
      "title": "White Sand",
      "germanTitles": ["Weißer Sand"],
      "setting": "Taldain",
      "series": "Standalones",
      "format": "Novel",
      "arcanumUnbounded": false,
      "dependencies": [
        { "id": "alloy-of-law", "type": "recommended" }
      ]
    },
    {
      "id": "sixth-of-the-dusk",
      "title": "Sixth of the Dusk",
      "germanTitles": [],
      "setting": "First of the Sun",
      "series": "Standalones",
      "format": "Novella",
      "arcanumUnbounded": true,
      "dependencies": []
    },
    {
      "id": "shadows-for-silence",
      "title": "Shadows for Silence in the Forests of Hell",
      "germanTitles": [],
      "setting": "Threnody",
      "series": "Standalones",
      "format": "Novella",
      "arcanumUnbounded": true,
      "dependencies": []
    },
    {
      "id": "tress-of-the-emerald-sea",
      "title": "Tress of the Emerald Sea",
      "germanTitles": ["Weit über der smaragdgrünen See"],
      "setting": "Lumar",
      "series": "Standalones",
      "format": "Novel",
      "arcanumUnbounded": false,
      "dependencies": [
        { "id": "hero-of-ages", "type": "recommended" },
        { "id": "elantris", "type": "recommended" },
        { "id": "warbreaker", "type": "nice_to_have" },
        { "id": "way-of-kings", "type": "nice_to_have" }
      ]
    },
    {
      "id": "yumi-and-the-nightmare-painter",
      "title": "Yumi and the Nightmare Painter",
      "germanTitles": ["Yumi and the Nightmare Painter"],
      "setting": "Komashi",
      "series": "Standalones",
      "format": "Novel",
      "arcanumUnbounded": false,
      "dependencies": [
        { "id": "rhythm-of-war", "type": "recommended" }
      ]
    },
    {
      "id": "isles-of-the-emberdark",
      "title": "Isles of the Emberdark",
      "germanTitles": [],
      "setting": "First of the Sun",
      "series": "Standalones",
      "format": "Novel",
      "arcanumUnbounded": false,
      "dependencies": [
        { "id": "sixth-of-the-dusk", "type": "required" }
      ]
    }
  ]
};
