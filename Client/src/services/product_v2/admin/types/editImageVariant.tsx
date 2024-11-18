

export interface EditImageVariantResponse {
  success: boolean;
  msg: string;
  status?: number;
  imageVariant?: ImageVariant;
  error?: string;
  color?: Color;
}

export interface Color {
  _id: string;
  name: string;
  code: string;
}

export interface ImageVariant {
  _id: string;  
  image?: FileList;
  productVariant: string;  
  color?: string; 
  createdAt: string;  
  updatedAt: string;  
}
export interface ImageVariantResponse {
  success: boolean;
  err: number;
  msg: string;
  status: number;
  imageVariant?: ImageVariant;
  error?: string;  
}