// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Link, useLocation, useNavigate } from "react-router-dom";

// import "react-toastify/dist/ReactToastify.css";
// import { createOrderThunk } from "../../../../redux/order/orderThunks";
// import { AppDispatch, RootState } from "../../../../redux/store";
// import { Order } from "../../../../types/order/order";
// import { CartItem } from "../../../../types/cart/carts";

// const CompletePage: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const address = useSelector((state: RootState) => state.auth.profile);
//   const defaultAddress = address?.profile?.addresses.find(
//     (address) => address.isDefault === true
//   );
//   const profile = useSelector((state: RootState) => state.auth.profile.profile);
//   const carts = useSelector((state: RootState) => state.cart.carts);

//   const [cart] = useState<any>(null);
//   const [, setOrderId] = useState<string | null>(null);

//   useEffect(() => {
//     const query = new URLSearchParams(location.search);
//     const paymentResult = query.get("paymentResult");
//     const orderIdFromQuery = query.get("orderId");

//     if (paymentResult === "success" && orderIdFromQuery) {
//       setOrderId(orderIdFromQuery);
//       handleOrderCreation(orderIdFromQuery);
//     }
//   }, [location.search]);

//   const generateOrderData = (
//     paymentMethod: string,
//     orderIdParam?: string
//   ): Order => {
//     return {
//       cartId: carts[0]._id,
//       user: profile?._id ? profile : null,
//       cartDetails: [
//         {
//           _id: cart?._id,
//           order: orderIdParam || "",
//           items: cart?.items.map((item: CartItem) => ({
//             product: {
//               ...item.product,
//               product_attributes: item.product.product_attributes.map(
//                 (attr) => ({
//                   k: attr.k,
//                   v: attr.v,
//                 })
//               ),
//             },
//             quantity: item.quantity,
//             price: item.product.product_price_unit,
//             totalItemPrice: item.product.product_price_unit * item.quantity,
//             _id: item._id,
//           })),
//         },
//       ],
//       payment: {
//         amount: carts[0].totalPrice,
//         payment_method: paymentMethod,
//         order_info: orderIdParam || "",
//       },
//       shipping: {
//         recipientName: profile?.name || "",
//         phoneNumber: profile?.phone || "",
//         address: defaultAddress?.address || "",
//       },
//       voucher: [],
//       formatShipping: "Nhanh",
//       totalAmount: carts[0].totalPrice,
//       shippingFee: 0,
//       totalPriceWithShipping: carts[0].totalPrice,
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//     };
//   };

//   const handleOrderCreation = async (orderId: string) => {
//     const orderData = generateOrderData("vnPay", orderId);

//     try {
//       await dispatch(createOrderThunk(orderData)).unwrap();

//       setTimeout(() => {
//         navigate("/");
//       }, 2000);
//     } catch (error) {
//       console.error("Failed to create order:", error);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
//         <h1 className="text-3xl font-bold text-center text-green-600 mb-4">
//           Thanh toán thành công!
//         </h1>
//         <p className="text-gray-600 text-center mb-6">
//           Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được xác nhận và sẽ được
//           xử lý sớm nhất.
//         </p>
//         <div className="flex flex-col items-center">
//           <div className="mb-4">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-20 w-20 text-green-600"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//               strokeWidth={2}
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M5 13l4 4L19 7"
//               />
//             </svg>
//           </div>
//           <Link
//             to="/"
//             className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
//           >
//             Quay về trang chủ
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CompletePage;
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { createOrderThunk } from "../../../../redux/order/orderThunks";
import { AppDispatch, RootState } from "../../../../redux/store";
import { Order } from "../../../../types/order/order";
import { CartItem } from "../../../../types/cart/carts";

const CompletePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const address = useSelector((state: RootState) => state.auth.profile);
  const defaultAddress = address?.profile?.addresses.find(
    (address) => address.isDefault === true
  );
  const profile = useSelector((state: RootState) => state.auth.profile.profile);
  const carts = useSelector((state: RootState) => state.cart.carts);

  const [cart] = useState<any>(null);
  const [, setOrderId] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<
    "success" | "failure" | null
  >(null);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const paymentResult = query.get("paymentResult");
    const orderIdFromQuery = query.get("orderId");

    if (paymentResult === "success" && orderIdFromQuery) {
      setPaymentStatus("success");
      setOrderId(orderIdFromQuery);
      handleOrderCreation(orderIdFromQuery);
    } else if (paymentResult === "failure") {
      setPaymentStatus("failure");
      toast.error("Thanh toán không thành công. Vui lòng thử lại.");
    }
  }, [location.search]);

  const generateOrderData = (
    paymentMethod: string,
    orderIdParam?: string
  ): Order => {
    return {
      cartId: carts[0]._id,
      user: profile?._id ? profile : null,
      cartDetails: [
        {
          _id: cart?._id,
          order: orderIdParam || "",
          items: cart?.items.map((item: CartItem) => ({
            product: {
              ...item.product,
              product_attributes: item.product.product_attributes.map(
                (attr) => ({
                  k: attr.k,
                  v: attr.v,
                })
              ),
            },
            quantity: item.quantity,
            price: item.product.product_price_unit,
            totalItemPrice: item.product.product_price_unit * item.quantity,
            _id: item._id,
          })),
        },
      ],
      payment: {
        amount: carts[0].totalPrice,
        payment_method: paymentMethod,
        order_info: orderIdParam || "",
      },
      shipping: {
        recipientName: defaultAddress?.fullName || "",
        phoneNumber: defaultAddress?.phone || "",
        address: defaultAddress?.address || "",
      },
      voucher: [],
      formatShipping: "Nhanh",
      totalAmount: carts[0].totalPrice,
      shippingFee: 0,
      totalPriceWithShipping: carts[0].totalPrice,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  };

  const handleOrderCreation = async (orderId: string) => {
    const orderData = generateOrderData("vnPay", orderId);

    try {
      await dispatch(createOrderThunk(orderData)).unwrap();
      toast.success("Đơn hàng đã được tạo thành công!");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Failed to create order:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        {paymentStatus === "success" ? (
          <>
            <h1 className="text-3xl font-bold text-center text-green-600 mb-4">
              Thanh toán thành công!
            </h1>
            <p className="text-gray-600 text-center mb-6">
              Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được xác nhận và sẽ
              được xử lý sớm nhất.
            </p>
            <div className="flex flex-col items-center">
              <div className="mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-20 w-20 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <Link
                to="/"
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
              >
                Quay về trang chủ
              </Link>
            </div>
          </>
        ) : paymentStatus === "failure" ? (
          <>
            <h1 className="text-3xl font-bold text-center text-red-600 mb-4">
              Thanh toán thất bại!
            </h1>
            <p className="text-gray-600 text-center mb-6">
              Rất tiếc, thanh toán của bạn không thành công. Vui lòng thử lại.
            </p>
            <div className="flex flex-col items-center">
              <Link
                to="/"
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
              >
                Quay về trang chủ
              </Link>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default CompletePage;
