
export interface Product {
  _id: string;
  name: string;
  status: string;
  price: number;
  image?: string;
  quantity: number;
  categoryid: string;
  weight?: number;
  brand?: string;
  color?: string;
  description?: string;
  discount: string;
  rating: number;
  view: number;
}

export interface ProductState {
  products: Product[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
