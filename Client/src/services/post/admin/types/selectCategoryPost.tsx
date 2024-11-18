export interface CategoryPost {
  _id: string;
  name: string;
}

export interface SelectCategoryPostResponse {
  success: boolean;
  err: number;
  msg: string;
  status: number;
  categoryPosts: CategoryPost[];
}
