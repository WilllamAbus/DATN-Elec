// src/hooks/useVnPay.ts
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { VnPaymentThunk } from "../redux/pay/vnpay";
import { useState } from "react";

const useVnPay = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleVnPayPayment = async () => {
    setLoading(true);
    setError(null);
    try {
      await dispatch(VnPaymentThunk()).unwrap();
      setSuccess(true);
      // Handle successful VNPay payment (e.g., redirect to payment page)
      window.location.href = "/vnpay";
    } catch (err) {
      setError("Đã xảy ra lỗi trong quá trình thanh toán VNPay.");
    } finally {
      setLoading(false);
    }
  };

  return { handleVnPayPayment, loading, error, success };
};

export default useVnPay;
