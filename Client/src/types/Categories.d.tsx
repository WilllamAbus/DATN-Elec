// src/types/category.d.ts
export interface Category {
    _id: string;
    name: string;
    pid: string;
    path: string;
    imgURL: string; // The path or URL to the image in Firebase Storage
    createdAt: string;
    updatedAt: string;
    __v: number;
  }
  