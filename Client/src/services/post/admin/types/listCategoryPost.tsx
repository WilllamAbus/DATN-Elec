export interface Category {
  _id: string;
  name: string;
  sku: string;
  pid: string;
  image: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
  slug: string;

}
export interface Pagination {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
export interface CategoryPostResponse {
  success: boolean;
  err: number;
  msg: string;
  status: number;
  data: {
    total: number;
    categories: Category[];
  };
  pagination: Pagination;
}


