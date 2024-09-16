// import { useDispatch } from "react-redux";
// import { setPaymentStatus } from "../redux/order/orderSlice";
// import { useLocation } from "react-router-dom";
// import { useEffect } from "react";

// const PaymentResult = () => {
//   const dispatch = useDispatch();
//   const location = useLocation();

//   const getPaymentResult = () => {
//     const queryParams = new URLSearchParams(location.search);
//     const responseCode = queryParams.get("vnp_ResponseCode");

//     if (responseCode === "00") {
//       dispatch(setPaymentStatus("success"));

//       return "Thanh toán thành công!";
//     } else {
//       dispatch(setPaymentStatus("failure"));
//       return `Lỗi thanh toán. Mã lỗi: ${responseCode}`;
//     }
//   };

//   useEffect(() => {
//     getPaymentResult();
//   }, []);

//   return (
//     <div>
//       <h1>Kết quả thanh toán</h1>
//       <p>{getPaymentResult()}</p>
//     </div>
//   );
// };

// export default PaymentResult;
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";

import { setPaymentStatus } from "../redux/order/orderSlice";
const PaymentResult = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const status = queryParams.get("status");
    // const orderId = queryParams.get("orderId");

    if (status === "success") {
      dispatch(setPaymentStatus("success"));
      // Thực hiện các hành động khác nếu cần
    } else {
      dispatch(setPaymentStatus("failure"));
      // Thực hiện các hành động khác nếu cần
    }
  }, [location, dispatch]);

  return (
    <div>
      <h1>Kết quả thanh toán</h1>
      <p>
        {location.search.includes("status=success")
          ? "Thanh toán thành công!"
          : "Thanh toán thất bại!"}
      </p>
    </div>
  );
};

export default PaymentResult;
