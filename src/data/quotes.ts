// src/data/quotes.ts

export type Quote = {
    id: number;
    text: string;
    author?: string;
  };
  
  export const quotes: Quote[] = [
    {
      id: 1,
      text: "La vie est un défi à relever, un bonheur à mériter, une aventure à tenter.",
      author: "Mère Teresa",
    },
    {
      id: 2,
      text: "Fais de ta vie un rêve, et d’un rêve une réalité.",
      author: "Antoine de Saint-Exupéry",
    },
    {
      id: 3,
      text: "Le succès, c’est tomber sept fois, se relever huit.",
      author: "Proverbe japonais",
    },
    {
      id: 4,
      text: "L'échec n'est qu'un tremplin vers la réussite.",
      author: "Oprah Winfrey",
    },
    {
      id: 5,
      text: "Ne rêve pas ta vie, vis tes rêves.",
    },
  ];
  