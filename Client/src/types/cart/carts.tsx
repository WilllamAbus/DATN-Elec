export interface CartItem {
  _id: string;
  product: {
    _id: string;
    product_name: string;
    product_description: string;
    product_type: string;
    createdAt: string;
    product_discount: number;
    product_supplier: string;
    product_brand: string;
    product_format: string;
    product_condition: string;
    product_quantity: number;
    product_price: number;
    product_price_unit: number;
    product_attributes: { k: string; v: string }[];
    weight_g: number;
    image: string[];
  };
  quantity: number;
  price: number;
  totalItemPrice: number;
  isSelected?: boolean; // Thêm trường selected để đánh dấu sản phẩm đã chọn hay chưa
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
