export interface Category {
  _id: string;
  name: string;
  description?: string;
  status: string; 
  parent_id?: string; 
}

export interface SelectCategoryResponse {
  success: boolean;
  err: number;
  msg: string;
  status: number;
  categories: Category[];
}
