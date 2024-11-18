
export interface Product {
  _id: string;
}

export interface Category {
  _id: string;
  name: string;
}

export interface Post {
  _id: string;
  title: string;
  content: string;
  product: Product;
  thumbnail: string[];
  category: Category;
  status: string;
  sku: string;
  pid: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
  __v: number;
}

export interface ResponsePost {
  success: boolean;
  err: number;
  msg: string;
  status: number;
  data: PostData;
  pagination: Pagination;
}

export interface PostData {
  total: number;
  posts: Post[];
}


export interface Pagination {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
