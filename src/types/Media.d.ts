// src/types/Media.d.ts
export interface Media {
    id: number;
    photographerId: number;
    title: string;
    image?: string;
    video?: string;
    likes: number;
    date: string;
    price: number;
  }
  