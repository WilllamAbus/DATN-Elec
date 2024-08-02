export interface Product {
  _id: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  categoryid: string;
  createdAt: string;
  weight?: number;
  brand?: string;
  color?: string;
  description?: string;
  discount: string;
}
