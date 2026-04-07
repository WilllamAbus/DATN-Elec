
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
export interface ImageVariantState {
  imageVariants: ImageVariant[];
  status: "idle" | "loading" | "success" | "fail";
  error: string | null;
  isLoading: boolean;
}


export const initialImageVariantState: ImageVariantState = {
  imageVariants: [],
  status: "idle",
  error: null,
  isLoading: false,
};