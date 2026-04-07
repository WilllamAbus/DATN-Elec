export interface Post {
  _id: string;
  title: string;
  slug: string;
  content: string;
  status:string;
  product: string; 
  thumbnail?: FileList; 
  category: string; 
  sku: string;
  pid: string;
  createdAt: string;
  updatedAt: string; 
}
export interface responsePost {
  success: boolean;
  err: number;
  msg: string;
  status: number;
  post?: Post;  
  error?: string;  
}
interface PostState {
  posts: Post[]; 
  status: 'idle' | 'loading' | 'success' | 'fail'; 
  error: string | null; 
  isLoading: boolean; 
}

export const initialPostState: PostState = {
  posts: [], 
  status: 'idle', 
  error: null, 
  isLoading: false, 
};