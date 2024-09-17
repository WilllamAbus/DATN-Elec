import { Voucher as Voucher } from "../Voucher.d";
import { UserProfile } from "../user";

export interface ProductAttribute {
  k: string;
  v: string;
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
  _id: string;
  order: string;

  items: {
    product: Product;
    quantity: number;
    price: number;
    totalItemPrice: number;
    _id: string;
  }[];
}

export interface Payment {
  amount: number;
  payment_method: string;
  order_info?: string;
}

export interface shipping {
  recipientName: string;
  phoneNumber: string;
  address: string;
  stateShipping?: string;
  disabledAt?: string | null;
  modifieon?: string;
}

export interface Order {
  _id?: string;
  cartId: string; // ID của giỏ hàng
  user: UserProfile | null;
  cartDetails: CartDetail[];
  payment: Payment;
  shipping: shipping;
  voucher: Voucher[];
  formatShipping: string;
  totalAmount: number;
  shippingFee: number;
  totalPriceWithShipping: number;
  stateOrder?: string;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrderDetailResponse {
  _id: string;
  order: {
    _id: string;
    user: string;
    cartDetails: string[];
    payment: string | null;
    shipping: string;
    voucherIds: string[];
    formatShipping: string;
    totalAmount: number;
    shippingFee: number;
    totalPriceWithShipping: number;
    stateOrder: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  items: Array<{
    product: {
      product_discount: {
        discountId: string;
        code: string;
        discountPercent: number;
        isActive: boolean;
        status: string;
        disabledAt: string | null;
      };
      _id: string;
      product_name: string;
      image: string[];
      product_description: string;
      product_type: string;
      product_brand: string;
      product_format: string;
      product_condition: string;
      product_supplier: string;
      product_quantity: number;
      product_ratingAvg: number;
      product_view: number;
      product_price: number;
      product_price_unit: number;
      product_attributes: Array<{
        k: string;
        v: string;
        _id: string;
      }>;
      weight_g: number;
      isActive: boolean;
      status: string;
      disabledAt: string | null;
      comments: Array<any>;
      createdAt: string;
      updatedAt: string;
      product_slug: string;
      __v: number;
      variants: string[];
      hasVariants: string;
    };
    quantity: number;
    price: number;
    totalItemPrice: number;
    _id: string;
  }>;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
