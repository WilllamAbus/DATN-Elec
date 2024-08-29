export interface CartItem {
  _id: string;
  product: {
    _id: string;
    product_name: string;
    image: string[];
    product_description: string;
    product_price: number;
  };
  quantity: number;
  price: number;
  totalItemPrice: number;
}

export interface CartType {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    address: string;
    phone: string;
  };
  items: CartItem[];
  totalPrice: number;
  stateNotifi: string;
  isActive: boolean;
  status: string;
  disabledAt: string | null;
  modifieon: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
