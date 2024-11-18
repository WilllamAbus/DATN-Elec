export interface Category {
  _id: string;
  name: string;
}
export interface SelectCategoryResponse {
  success: boolean;
  err: number;
  msg: string;
  status: number;
  selectCategories: Category[];
}
