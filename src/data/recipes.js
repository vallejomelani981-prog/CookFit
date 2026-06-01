export const RECIPES = [

  {
    id: 1,
    name: 'Ensalada Saludable',
    calories: '320 kcal',
    protein: '18g',
    time: '10 min',
    tag: 'Bajo en calorías',

    image:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80',

    description:
      'Una receta fresca y saludable perfecta para cualquier momento del día.',

    ingredients: [
      'Lechuga',
      'Tomate cherry',
      'Pechuga de pollo',
      'Aguacate',
      'Aceite de oliva',
      'Limón',
    ],

    steps: [
      'Lava todos los vegetales.',
      'Cocina el pollo a fuego medio.',
      'Corta el tomate y aguacate.',
      'Mezcla todo y sirve.',
    ],

    cookingSteps: [
      {
        title: 'Lava los vegetales',
        desc: 'Lava y seca bien la lechuga y el tomate.',
        tip: '💡 Usa agua fría para mantener frescos los vegetales.',
        duration: 120,
        emoji: '🥗',
      },

      {
        title: 'Cocina el pollo',
        desc: 'Cocina el pollo durante 5 minutos por lado.',
        tip: '🍳 Cocina a fuego medio.',
        duration: 600,
        emoji: '🍗',
      },

      {
        title: 'Mezcla ingredientes',
        desc: 'Agrega todos los ingredientes en un bowl.',
        tip: '🥑 Añade aguacate al final.',
        duration: 180,
        emoji: '🥣',
      },
    ],
  },

  {
    id: 2,
    name: 'Pasta Fit',
    calories: '420 kcal',
    protein: '28g',
    time: '20 min',
    tag: 'Alto en proteína',

    image:
      'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&q=80',

    description:
      'Pasta balanceada rica en proteína y energía.',

    ingredients: [
      'Pasta integral',
      'Pollo',
      'Queso parmesano',
      'Aceite de oliva',
    ],

    steps: [
      'Hierve la pasta.',
      'Cocina el pollo.',
      'Mezcla todos los ingredientes.',
      'Sirve caliente.',
    ],

    cookingSteps: [
      {
        title: 'Hervir pasta',
        desc: 'Hierve agua y cocina la pasta.',
        tip: '🍝 Añade sal al agua.',
        duration: 600,
        emoji: '🍝',
      },

      {
        title: 'Cocinar pollo',
        desc: 'Cocina el pollo en sartén.',
        tip: '🔥 Cocina bien el centro.',
        duration: 480,
        emoji: '🍗',
      },

      {
        title: 'Mezclar',
        desc: 'Integra todos los ingredientes.',
        tip: '🧀 Agrega queso al final.',
        duration: 120,
        emoji: '🥣',
      },
    ],
  },

]