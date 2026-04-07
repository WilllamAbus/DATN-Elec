// types/post.tsx

// Interface cho Product
interface Product {
  _id: string;
  product_name:string;
}

// Interface cho Category
interface Category {
  _id: string;
  name: string;
}

// Interface chính cho Post
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

// Interface cho response của API getOnePost
export interface GetOnePostResponse {
  success: boolean;
  err: number;
  msg: string;
  status: number;
  post?: Post;
}
