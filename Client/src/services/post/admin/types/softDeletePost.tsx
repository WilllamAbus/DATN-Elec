
export interface PostData {
  _id: string;
  title: string;
  content: string;
  product: string;
  thumbnail: string[];
  category: string;
  status: string;
  sku: string;
  pid: string;
  createdAt: string;
  updatedAt: string;
  slug: string;

}
export interface PostResponse {
  success: boolean;
  err: number;
  msg: string;
  status: number;
  data?: PostData;
  error?: string;
}
