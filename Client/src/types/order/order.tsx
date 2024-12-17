import { Voucher as Voucher } from "../Voucher.d";
import { UserProfile } from "../user";
import { ProductVariant } from "../cart/carts";
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
  slug: string;
}

export interface CartDetail {
  _id: string;
  order: string;

  items: {
    product: Product;
    productVariant: ProductVariant;
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
  cartId: string;
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
  cancelReason?: string;
  refundBank?: {
    bankName?: string;
    accountNumber?: string;
    accountName?: string;
  };
  createdAt: string;
  updatedAt: string;
}
export interface CreateOrderResponse {
  order: Order;
  message?: string; // Thêm message nếu có trong phản hồi
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface LimitCrudOrderResponse {
  success: boolean;
  err: number;
  msg: string;
  status: number;
  data: {
    total: number;
    orders: Order[];
  };
  pagination: Pagination;
}

export interface LimitDeletedListResponse {
  success: boolean;
  err: number;
  msg: string;
  status: number;
  data: {
    total: number;
    orders: Order[];
  };
  pagination: Pagination;
}
export interface ApplyVoucherResponse {
  newTotalPrice: number;
}
export interface OrderItem {
  product: Product;
  productVariant: ProductVariant;
  quantity?: number;
}
