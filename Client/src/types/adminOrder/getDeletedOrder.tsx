// src/types/Checkout.d.ts

export interface OrdersDeletedResponse {
  status: number;
    message: string;
    data: {
      ordersDeleted: OrderDeleted[];
      totalPages: number;
      currentPage: number;
    };
}

export interface OrderDeleted {
  _id: string;
  stateOrder: string;
  status: string;
  disabledAt: string ;
  order_date: string;
  createdAt: string;
  updatedAt: string;
  shippingAddress: ShippingAddressDeleted,
  refundBank: RefundBankDeleted
}

export interface ShippingAddressDeleted {
  userID: string;
    recipientName: string;
    phoneNumber: string;
    address: string;
    email: string;
    addressID: string;
}

export interface RefundBankDeleted {
  bankCode: string;
  orderInForVnPay: string;
  paymentDateVnPay: string;
  transiTionAmout: string;
}
