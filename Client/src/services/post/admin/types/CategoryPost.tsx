

export interface Category {
  name: string;
  sku: string;
  image?: FileList;
  pid: string;
  _id: string;
  createdAt: string; 
  updatedAt: string; 
  slug: string;
  status:string
}

export interface CategoryResponse {
  success: boolean;
  err: number;
  msg: string;
  status: number;
  category?: Category;
  error?: string;
}

export interface SoftDeleteResponse {
  success: boolean;
  err: number;
  msg: string;
  status: number;
  data?: Category;
  error?: string;
}