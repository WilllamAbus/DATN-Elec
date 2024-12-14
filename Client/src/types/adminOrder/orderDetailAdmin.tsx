export interface ShippingInfo {
    userId: string;
    recipientName: string;
    phoneNumber: string;
    address: string;
    email: string;
  }

  export interface RefundBank {
    bankCode: string;
    orderInForVnPay: string;
    paymentDateVnPay: string;
    transiTionAmout: string;

  }
  
  export interface OrderAuctionDetailsAdmin {
    shippingInfo?: ShippingInfo;  // Thay đổi từ shippingInfo bắt buộc sang tùy chọn
    products: Product[];
    state: string, 
    paymetMethod: string , 
    totalPrice: String
    orderid: string,
    dateOrder:string,
    refundPay?: RefundBank;
  }
  
  // Ví dụ về Product
  export interface Product {
    name: string;
    price: number;
    image: string[];
  }

  export interface OrderDetailAdminResponse {
    success: boolean;
    status: number;
    error: number;
    data: OrderAuctionDetailsAdmin;
  }