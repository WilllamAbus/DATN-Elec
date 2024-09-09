import { Voucher as Voucher } from "../Voucher.d";
import { UserProfile } from "../user";
export interface ProductAttribute {
  k: string;
  v: string;
  // _id?: string;
}

export interface Product {
  _id: string;
  product_name: string;
  image: string[];
  product_type: string;
  product_brand: string;
  product_format: string;
  product_condition: string;
  product_supplier: string;
  product_price_unit: number;
  product_attributes: ProductAttribute[];
  weight_g: number;
}

export interface CartDetail {
  product: Product;
  quantity: number;
  price: number;
  totalItemPrice: number;
  _id: string;
}

export interface Payment {
  amount: number;
  payment_date: string;
  payment_method: string;
}

export interface ShippingAddress {
  recipientName: string;
  phoneNumber: string;
  address: string;
  disabledAt: string | null;
  modifieon: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  _id?: string;
  cartId: string;
  user: UserProfile | null; // Điều chỉnh để phù hợp với dữ liệu của bạn
  cartDetails: CartDetail[];
  payment: Payment;
  shippingAddressId: ShippingAddress;
  voucher: Voucher[];
  formatShipping: string;
  totalAmount: number;
  shippingFee: number;
  totalPriceWithShipping: number;
  stateOrder?: string;
  createdAt: string;
  updatedAt: string;
}
