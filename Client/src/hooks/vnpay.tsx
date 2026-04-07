import { useState } from "react";

import { toast } from "react-toastify";
import instance from "../services/axios";
export const useVNPay = () => {
  const [loading, setLoading] = useState(false);

  const createPaymentUrl = async (
    amount: number,
    bankCode?: string,
    language: string = "vn"
  ) => {
    try {
      setLoading(true);
      const response = await instance.post(
        "http://localhost:4000/api/vnpay/create_payment_url",
        {
          amount,
          bankCode,
          language,
        }
      );
      const { paymentUrl } = response.data;

      return paymentUrl; // Trả về URL cho client
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || "Lỗi không xác định";
      toast.error("Không thể tạo URL thanh toán VNPay: " + errorMessage);
      return null; // Trả về null nếu có lỗi
    } finally {
      setLoading(false);
    }
  };

  // Không cần verifyPayment trong hook này vì bạn xử lý trực tiếp trong component
  return { createPaymentUrl, loading };
};
export const useVNPayAuction = () => {
  const [loading, setLoading] = useState(false);

  const createPaymentAuctionUrl = async (
    amount: number,
    bankCode?: string,
    language: string = "vn"
  ) => {
    try {
      setLoading(true);
      const response = await instance.post(
        "http://localhost:4000/api/vnpayAuction/create_payment_url",
        {
          amount,
          bankCode,
          language,
        }
      );
      const { paymentUrl } = response.data;

      return paymentUrl; // Trả về URL cho client
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || "Lỗi không xác định";
      toast.error("Không thể tạo URL thanh toán VNPay: " + errorMessage);
      return null; // Trả về null nếu có lỗi
    } finally {
      setLoading(false);
    }
  };

  // Không cần verifyPayment trong hook này vì bạn xử lý trực tiếp trong component
  return { createPaymentAuctionUrl, loading };
};
