// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useLocation, useNavigate, useParams } from "react-router-dom";

// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { createOrderThunk } from "../../../../redux/order/orderThunks";
// import {
//   fetchCartById,
//   CheckVoucherThunk,
// } from "../../../../redux/cart/cartThunk";
// import { AppDispatch, RootState } from "../../../../redux/store";
// import { Order } from "../../../../types/order/order";
// import { useForm, SubmitHandler } from "react-hook-form";
// import { useVNPay } from "../../../../hooks/vnpay";
// import { CartItem } from "../../../../types/cart/carts";
// import { Card } from "flowbite-react";

// type FormData = {
//   payment: string;
//   voucherCode: string;
// };

// const CheckoutPage: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { id } = useParams<{ id: string }>();
//   const userId = useSelector(
//     (state: RootState) => state.auth.profile.profile?._id
//   );
//   const address = useSelector(
//     (state: RootState) => state.auth.profile.profile?.address
//   );
//   const profile = useSelector((state: RootState) => state.auth.profile.profile);
//   const carts = useSelector((state: RootState) => state.cart.carts);
//   const { createPaymentUrl } = useVNPay();

//   const [cart, setCart] = useState<any>(null); // Lưu trữ thông tin giỏ hàng
//   const [orderId, setOrderId] = useState<string | null>(null);
//   const { handleSubmit } = useForm<FormData>();
//   const [selectedPayment, setSelectedPayment] = useState("");
//   useEffect(() => {
//     if (id) {
//       dispatch(fetchCartById(id)).then((result) => {
//         if (result.payload) {
//           setCart(result.payload); // Lưu giỏ hàng vào state
//         }
//       });
//     }
//   }, [dispatch, id]);

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
//         address: address || "",
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

//   // Xử lý sau khi VNPay trả về kết quả
//   useEffect(() => {
//     const query = new URLSearchParams(location.search);
//     const paymentResult = query.get("paymentResult");
//     const orderIdFromQuery = query.get("orderId");

//     if (paymentResult === "success" && orderIdFromQuery) {
//       setOrderId(orderIdFromQuery);
//       handleOrderCreation(orderIdFromQuery);
//     }
//   }, [location.search]);

//   const handleOrderCreation = async (orderId: string) => {
//     if (!orderId) {
//       toast.error("orderId không hợp lệ.");
//       return;
//     }
//     if (!userId) {
//       toast.error("Thông tin người dùng không hợp lệ.");
//       return;
//     }
//     if (!address) {
//       toast.error("Địa chỉ giao hàng không hợp lệ.");
//       return;
//     }
//     const orderData = generateOrderData("vnPay", orderId);

//     try {
//       await dispatch(createOrderThunk(orderData)).unwrap();
//       toast.success("Đặt hàng thành công");
//       setTimeout(() => {
//         navigate("/");
//       }, 2000);
//     } catch (error) {
//       console.error("Failed to create order:", error);
//       toast.error("Tạo đơn hàng thất bại.");
//     }
//   };

//   const handleCheckout: SubmitHandler<FormData> = async () => {
//     if (!userId) {
//       toast.error("Thông tin người dùng không hợp lệ.");
//       return;
//     }
//     if (!address) {
//       toast.error("Địa chỉ giao hàng không hợp lệ.");
//       return;
//     }
//     if (!cart || cart.items.length === 0) {
//       toast.error("Giỏ hàng trống.");
//       return;
//     }

//     if (!selectedPayment) {
//       toast.error("Chưa chọn phương thức thanh toán.");
//       return;
//     }

//     const orderData = generateOrderData(selectedPayment);

//     try {
//       if (selectedPayment === "vnPay") {
//         const paymentUrl = await createPaymentUrl(carts[0].totalPrice);
//         if (paymentUrl) {
//           window.location.href = paymentUrl;
//         }
//       } else {
//         await dispatch(createOrderThunk(orderData)).unwrap();
//         setOrderId(orderId);
//         toast.success("Đặt hàng thành công");
//         setTimeout(() => {
//           navigate("/");
//         }, 2000);
//       }
//     } catch (error) {
//       console.error("Failed to create order:", error);
//       toast.error("Thanh toán thất bại.");
//     }
//   };

//   return (
//     <>
//       <div>
//         <form onSubmit={handleSubmit(handleCheckout)}>
//           <div className="flex flex-col items-center border-b bg-white py-4 sm:flex-row sm:px-10 lg:px-20 xl:px-32">
//             <a href="#" className="text-2xl font-bold text-gray-800">
//               sneekpeeks
//             </a>
//           </div>
//           <div className="grid sm:px-10 lg:grid-cols-2 lg:px-20 xl:px-32">
//             <div className="px-4 pt-8">
//               <p className="text-xl font-medium">Order Summary</p>
//               <p className="text-gray-400">
//                 Check your items. And select a suitable shipping method.
//               </p>
//               {cart && Array.isArray(cart.items) && cart.items.length > 0 ? (
//                 <div>
//                   {cart.items.map((item: any) => (
//                     <div className="mt-8 space-y-3 rounded-lg border bg-white px-2 py-4 sm:px-6">
//                       {/* Các sản phẩm trong đơn hàng */}

//                       <div className="flex flex-col rounded-lg bg-white sm:flex-row">
//                         <img
//                           className="m-2 h-24 w-28 rounded-md border object-cover object-center"
//                           src={item.product.image}
//                           alt={item.product.product_name}
//                         />
//                         <div className="flex w-full flex-col px-4 py-4">
//                           <span className="font-semibold">
//                             {item.product.product_name}
//                           </span>
//                           <span className="float-right text-gray-400">
//                             Số lượng: {item.quantity}
//                           </span>
//                           <p className="mt-auto text-lg font-bold">
//                             {" "}
//                             {item.product.product_price_unit.toLocaleString(
//                               "vi-VN",
//                               { style: "currency", currency: "VND" }
//                             )}{" "}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-gray-500">Giỏ hàng trống.</p>
//               )}

//               <div className="space-y-4">
//                 <Card>
//                   <h4 className="text-md font-medium">Tổng giá trị đơn hàng</h4>
//                   <p className="text-lg font-semibold">
//                     {carts[0].totalPrice.toLocaleString("vi-VN", {
//                       style: "currency",
//                       currency: "VND",
//                     })}
//                   </p>
//                 </Card>
//                 {/* Other summary details can go here */}
//               </div>

//               <p className="mt-8 text-lg font-medium">Phương thức thanh toán</p>
//               <div className="mt-5 grid gap-6">
//                 <div className="relative">
//                   <input
//                     className="peer hidden"
//                     id="radio_1"
//                     type="radio"
//                     name="payment"
//                     value="Thanh toán khi nhận hàng"
//                     checked={selectedPayment === "Thanh toán khi nhận hàng"}
//                     onChange={(e) => setSelectedPayment(e.target.value)}
//                   />
//                   <span className="peer-checked:border-gray-700 absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white"></span>
//                   <label
//                     className="peer-checked:border-2 peer-checked:border-gray-700 peer-checked:bg-gray-50 flex cursor-pointer select-none rounded-lg border border-gray-300 p-4"
//                     htmlFor="radio_1"
//                   >
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       viewBox="0 0 32 40"
//                       width="50"
//                       height="50"
//                       fill="#FF0000"
//                     >
//                       <path d="M2,30.5H5.73047a.49971.49971,0,0,0,.5-.5v-.58789h2.6748a.49971.49971,0,0,0,.5-.5V28.793l5.64063.85254h3.61426a.49964.49964,0,0,0,.35352-.14648l4.707-4.707a2.12241,2.12241,0,0,0-.27051-3.22949,2.18563,2.18563,0,0,0-2.791.291l-2.207,2.20605H16.9873a3.53762,3.53762,0,0,0-3.49609-3.03125.49207.49207,0,0,0-.09961.00977l-3.98633.81067v-.087a.49971.49971,0,0,0-.5-.5H6.23047v-.58789a.49971.49971,0,0,0-.5-.5H2a.49971.49971,0,0,0-.5.5V30A.49971.49971,0,0,0,2,30.5Zm11.53906-8.47168a2.53627,2.53627,0,0,1,2.43341,2.03125H13.41309a.5.5,0,1,0,0,1h5.24609a.49964.49964,0,0,0,.35352-.14648l2.35352-2.35254a1.17511,1.17511,0,0,1,1.5-.18555,1.1224,1.1224,0,0,1,.14746,1.71l-4.56152,4.56055-3.33105.00586-5.71582-.86914V22.86914Zm-5.13379.2334v6.15039H6.23047V22.26172ZM2.5,21.17383H5.23047V29.5H2.5Z" />
//                       <path d="M30,1.5H26.26953a.49971.49971,0,0,0-.5.5v.58789h-2.6748a.49971.49971,0,0,0-.5.5V3.207L16.9541,2.35449H13.33984a.49964.49964,0,0,0-.35352.14648L8.2793,7.208A2.12241,2.12241,0,0,0,8.5498,10.4375a2.18574,2.18574,0,0,0,2.791-.291l2.207-2.20605H15.0127a3.53762,3.53762,0,0,0,3.49609,3.03125.49207.49207,0,0,0,.09961-.00977l3.98633-.81067v.087a.49971.49971,0,0,0,.5.5h2.6748v.58789a.49971.49971,0,0,0,.5.5H30a.49971.49971,0,0,0,.5-.5V2A.49971.49971,0,0,0,30,1.5ZM18.46094,9.97168a2.53627,2.53627,0,0,1-2.43341-2.03125h2.55939a.5.5,0,0,0,0-1H13.34082a.49964.49964,0,0,0-.35352.14648L10.63379,9.43945a1.17906,1.17906,0,0,1-1.5.18555,1.1224,1.1224,0,0,1-.14746-1.71l4.56152-4.56055,3.33105-.00586,5.71582.86914V9.13086Zm5.13379-.2334V3.58789h2.1748V9.73828ZM29.5,10.82617H26.76953V2.5H29.5Z" />
//                       <path d="M23.06445,19.68066a.49971.49971,0,0,0,.5-.5V12.81934a.49971.49971,0,0,0-.5-.5H8.93555a.49971.49971,0,0,0-.5.5v6.36133a.49971.49971,0,0,0,.5.5ZM9.43555,13.31934H22.56445v5.36133H9.43555Z" />
//                       <path d="M16,14.19238A1.80869,1.80869,0,1,0,17.87109,16,1.84234,1.84234,0,0,0,16,14.19238Zm0,2.61523A.80993.80993,0,1,1,16.87109,16,.842.842,0,0,1,16,16.80762Z" />
//                     </svg>

//                     <div className="ml-5">
//                       <span className="mt-2 font-semibold">
//                         Thanh toán khi nhận hàng
//                       </span>
//                       <p className="text-slate-500 text-sm leading-6">
//                         Delivery: 2-4 Days
//                       </p>
//                     </div>
//                   </label>
//                 </div>

//                 <div className="relative">
//                   <input
//                     className="peer hidden"
//                     id="radio_2"
//                     type="radio"
//                     name="payment"
//                     value="vnPay"
//                     checked={selectedPayment === "vnPay"}
//                     onChange={(e) => setSelectedPayment(e.target.value)}
//                   />
//                   <span className="peer-checked:border-gray-700 absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white"></span>
//                   <label
//                     className="peer-checked:border-2 peer-checked:border-gray-700 peer-checked:bg-gray-50 flex cursor-pointer select-none rounded-lg border border-gray-300 p-4"
//                     htmlFor="radio_2"
//                   >
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       version="1.1"
//                       viewBox="-5.0 -10.0 110.0 135.0"
//                       width="50"
//                       height="50"
//                     >
//                       <path d="m69.262 93.727c0.089843 0.5-0.23438 0.98047-0.72656 1.0859l-21.965 3.6133c-0.48437 0.078125-0.94141-0.24609-1.0234-0.73047l-1.0625-6.5625c-0.042969-0.28125 0.035156-0.5625 0.20703-0.78516 0.097656-0.13281 0.24609-0.21875 0.40625-0.23438l22.566-1.1367h0.082032c0.49219 0 1.0117 0.22656 1.0625 0.66797zm-2.8281-6.9805-0.65234-4.0312c-0.058594-0.34375-0.38281-0.57422-0.72656-0.51953l-19.168 3.1523c-0.34375 0.0625-0.57812 0.38281-0.52734 0.73047l0.27734 1.7148zm10.777-36.059-10.312-17.207v17.145c0.49609 1.4531 0.18359 3.0625-0.82813 4.2188l-6.4062 7.2617 0.035157 3.9102v0.003906c0.003906 0.62891-0.50391 1.1484-1.1328 1.1562h-0.011718c-0.62891 0-1.1406-0.50781-1.1484-1.1367l-0.039062-4.3516v0.003906c0-0.28516 0.10156-0.55859 0.28516-0.76953l6.6953-7.5938c1.0156-1.1445 0.26172-2.8867-1.0039-4.0078-1.5-1.3242-3.957-2.0742-5.957 0.17578l-11.238 12.5 0.007812 0.003906c-2.2617 3.0781-3.0703 6.9844-2.2227 10.707 0.41406 1.5195 0.99219 2.9844 1.7266 4.375 0.9375 1.7812 1.6562 3.6719 2.1367 5.625l15.078-2.4766c-0.066406-1.8477 0.47656-3.668 1.5469-5.1758 0.042969-0.070313 0.097656-0.13672 0.15234-0.19922l10.172-10.555c2.9531-3.0625 4.7344-9.1328 2.4648-13.613zm-38.957 1.4297h-0.003906c0 0.44922 0.26953 0.85156 0.68359 1.0234 0.41406 0.17188 0.89062 0.074219 1.207-0.24219 0.31641-0.31641 0.41016-0.79297 0.24219-1.207-0.17187-0.41406-0.57812-0.68359-1.0234-0.68359-0.60938 0.003907-1.1055 0.5-1.1055 1.1094zm8.4141-15.723h0.48828v-0.48828l-0.48828 0.003906zm-9.8125-9.8945h0.40625v-0.40625h-0.40625zm6.5469 35.453h-0.003906c0.066406-0.33594-0.019532-0.68359-0.23828-0.94922-0.21484-0.26562-0.53906-0.42188-0.88281-0.42188h-11.398c-0.63281 0-1.1484 0.51562-1.1484 1.1484 0 0.63281 0.51562 1.1445 1.1484 1.1445h11.395c0.28906 0 0.5625-0.10938 0.77734-0.30469-1.0078 1.9648-1.5898 4.1211-1.7031 6.3281h-3.457c-0.63281 0-1.1484 0.51172-1.1484 1.1445 0 0.63281 0.51562 1.1445 1.1484 1.1445h3.4922-0.003906c0.0625 0.6875 0.16797 1.3711 0.32422 2.043 0.10547 0.44922 0.23438 0.88672 0.375 1.3125l-17.062-0.003907c-1.7969-0.003906-3.2461-1.457-3.2539-3.25v-66.473c0.007812-1.7969 1.457-3.25 3.2539-3.2539h36.34c1.793 0.007812 3.2422 1.4609 3.25 3.2539v42.566c-1.2031-1.0117-2.7188-1.582-4.293-1.6133-1.7891 0.011719-3.4766 0.81641-4.6172 2.1953l-2.6133 2.9062-10.562-0.003906c-0.51172-1.293-1.7617-2.1484-3.1562-2.1484s-2.6445 0.85547-3.1562 2.1484h-5.3281c-0.63281 0-1.1484 0.51562-1.1484 1.1484s0.51562 1.1445 1.1484 1.1445h5.2539c0.45313 1.4023 1.7539 2.3516 3.2266 2.3516s2.7773-0.94922 3.2305-2.3516h8.4258l-3 3.332h-9.1094c-0.63281 0-1.1445 0.51562-1.1445 1.1484s0.51172 1.1445 1.1445 1.1445h7.0547l-1.5117 1.6797c-0.023438 0.027344-0.046875 0.050781-0.066407 0.078125-0.36328 0.44531-0.69531 0.91797-0.98828 1.4102zm-4.7109-16.723c0-0.63281-0.51562-1.1484-1.1484-1.1484h-3.707c-0.64063 0-1.1562-0.51953-1.1562-1.1562v-3.2383c0-0.63281-0.51563-1.1445-1.1484-1.1445s-1.1445 0.51172-1.1445 1.1445v3.2383c0 1.9023 1.543 3.4453 3.4492 3.4453h3.7109-0.003906c0.63281 0.003906 1.1484-0.50781 1.1484-1.1406zm-7.1562-7.1367v-0.003906c0.63281 0 1.1445-0.51172 1.1445-1.1445v-1.2383c0-0.63281-0.51172-1.1445-1.1445-1.1445-0.63281 0-1.1484 0.51172-1.1484 1.1445v1.2422c0 0.62891 0.51562 1.1406 1.1484 1.1406zm16.145 5.0156c0.63281 0 1.1445-0.51562 1.1445-1.1484 0-0.63281-0.51172-1.1445-1.1445-1.1445h-11.695v-7.8867c0-0.63281-0.51172-1.1445-1.1445-1.1445-0.63281 0-1.1445 0.51172-1.1445 1.1445v9.0312c0 0.63281 0.51172 1.1445 1.1445 1.1445zm3.9766-11.703v-5.1055c0-0.63281-0.51562-1.1445-1.1484-1.1445h-5.7695c-0.63281 0-1.1484 0.51172-1.1484 1.1445 0 0.63281 0.51562 1.1445 1.1484 1.1445h4.625v5.1055h-0.003906c0 0.63281 0.51562 1.1445 1.1484 1.1445h1.0664v7.125h-1.5078c-0.63281 0-1.1445 0.51563-1.1445 1.1484s0.51172 1.1445 1.1445 1.1445h2.6484c0.63281 0 1.1484-0.51172 1.1484-1.1445v-9.418c0-0.63281-0.51562-1.1484-1.1484-1.1484zm-2.2109 6.1367v-2.7773c0-0.63281-0.51562-1.1484-1.1484-1.1484h-2.7773c-0.63281 0-1.1445 0.51562-1.1445 1.1484v2.7773-0.003907c0 0.63281 0.51172 1.1484 1.1445 1.1484h2.7773c0.63281-0.003906 1.1406-0.51562 1.1406-1.1484zm-6.6055-10.176h-1.5352c-0.63281 0-1.1445 0.51172-1.1445 1.1445 0 0.63281 0.51172 1.1484 1.1445 1.1484h1.5273c0.63281 0 1.1445-0.51562 1.1445-1.1484 0-0.63281-0.51172-1.1445-1.1445-1.1445zm-3.5703 3.2344c-0.63281 0-1.1484 0.51172-1.1484 1.1445v5.7969c0 0.63281 0.51562 1.1445 1.1484 1.1445h3.4766c0.63281 0 1.1484-0.51172 1.1484-1.1445 0-0.63281-0.51562-1.1484-1.1484-1.1484h-2.332v-4.6484c0-0.30469-0.12109-0.59766-0.33984-0.8125-0.21484-0.21484-0.50781-0.33203-0.8125-0.33203zm0.28125-5.6484c0-0.63281-0.51562-1.1484-1.1484-1.1484h-2.6992c-0.63281 0-1.1445 0.51562-1.1445 1.1484v2.6953c0 0.63281 0.51172 1.1445 1.1445 1.1445h2.6953c0.63281 0 1.1484-0.51172 1.1484-1.1445zm17.625 13.301c0-0.63281-0.51562-1.1445-1.1484-1.1445-0.63281 0-1.1445 0.51172-1.1445 1.1445v4.6719c0 0.64062-0.51953 1.1562-1.1602 1.1602h-12.395c-0.63281 0-1.1445 0.51172-1.1445 1.1445 0 0.63281 0.51172 1.1445 1.1445 1.1445h12.395c1.9062 0 3.4492-1.543 3.4492-3.4453zm0-5.4648c0-0.63281-0.51562-1.1445-1.1484-1.1445-0.63281 0-1.1445 0.51172-1.1445 1.1445v1.1328-0.003906c0 0.63281 0.51172 1.1484 1.1445 1.1484 0.63281 0 1.1484-0.51562 1.1484-1.1484zm-3.4531-13.195h-6.6055c-0.63281 0-1.1484 0.51172-1.1484 1.1445 0 0.63281 0.51562 1.1484 1.1484 1.1484h6.6055c0.63672 0 1.1562 0.51953 1.1562 1.1562v5.5547c0 0.63281 0.51172 1.1445 1.1445 1.1445 0.63281 0 1.1484-0.51172 1.1484-1.1445v-5.5547c-0.003906-1.9062-1.5469-3.4492-3.4492-3.4492zm-1.25-13.004c0 0.63281 0.51172 1.1484 1.1445 1.1484h0.0625c0.63281 0 1.1445-0.51562 1.1445-1.1484 0-0.63281-0.51172-1.1445-1.1445-1.1445h-0.0625c-0.30469 0-0.59766 0.12109-0.8125 0.33594-0.21484 0.21484-0.33203 0.50781-0.33203 0.80859zm-13.543 0c0 0.63281 0.51172 1.1484 1.1445 1.1484h6.2227c0.63281 0 1.1445-0.51562 1.1445-1.1484 0-0.63281-0.51172-1.1445-1.1445-1.1445h-6.2227c-0.63281 0-1.1445 0.51563-1.1445 1.1445zm-5.0938 13.004c-1.9023 0-3.4453 1.543-3.4492 3.4492v6.8047c0 0.63281 0.51562 1.1445 1.1484 1.1445 0.63281 0 1.1445-0.51172 1.1445-1.1445v-6.8047c0-0.64062 0.51953-1.1602 1.1602-1.1602h9.4922c0.63281 0 1.1484-0.51172 1.1484-1.1445 0-0.63281-0.51562-1.1484-1.1484-1.1484zm-6.0312-8.0195c0 0.63281 0.51172 1.1445 1.1445 1.1445h2.9414c0.63281 0 1.1445-0.51172 1.1445-1.1445 0-0.63281-0.51172-1.1484-1.1445-1.1484h-2.9414c-0.30469 0-0.59766 0.125-0.8125 0.33984-0.21094 0.21484-0.33203 0.50781-0.33203 0.8125zm4.082 4.4492c0.63281 0 1.1484-0.51172 1.1484-1.1445 0-0.63281-0.51562-1.1484-1.1484-1.1484h-2.9375c-0.63281 0-1.1445 0.51562-1.1445 1.1484 0 0.63281 0.51172 1.1445 1.1445 1.1445zm3.6992 41.609c0-0.63281-0.51172-1.1445-1.1445-1.1445h-3.5625c-0.63281 0-1.1484 0.51172-1.1484 1.1445 0 0.63281 0.51562 1.1484 1.1484 1.1484h3.5664c0.62891-0.003906 1.1406-0.51172 1.1406-1.1445z" />
//                     </svg>
//                     <div className="ml-5">
//                       <span className="mt-2 font-semibold">
//                         Thanh Toán VnPay
//                       </span>
//                       <p className="text-slate-500 text-sm leading-6">
//                         Delivery: 2-4 Days
//                       </p>
//                     </div>
//                   </label>
//                 </div>
//               </div>
//             </div>
//             <div className="mt-10 bg-gray-50 px-4 pt-8 lg:mt-0">
//               <p className="text-xl font-medium">Thông Tin Nhận Hàng</p>

//               <div className="">
//                 <label
//                   htmlFor="text"
//                   className="mt-4 mb-2 block text-sm font-medium"
//                 >
//                   Họ tên
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="text"
//                     id="text"
//                     name="text"
//                     className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
//                     value={profile?.name}
//                   />
//                   <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-4 w-4 text-gray-400"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                       strokeWidth={2}
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         d="M16 12v4m0 0H8m8 0h-8m0 0h8m-4 0v4m-4-4v4m-4-4h-2m16 0h-2M8 12H6m16 0h-2M4 6h16M4 10h16m-6-6h-2m4-4h2m-2 0H6m-4 4h2"
//                       />
//                     </svg>
//                   </div>
//                 </div>
//                 <label
//                   htmlFor="card_number"
//                   className="mt-4 mb-2 block text-sm font-medium"
//                 >
//                   Số điện thoại
//                 </label>
//                 <input
//                   type="text"
//                   id="card_number"
//                   className="w-full rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
//                   value={profile?.phone}
//                 />
//                 <label
//                   htmlFor="card_address"
//                   className="mt-4 mb-2 block text-sm font-medium"
//                 >
//                   Địa chỉ
//                 </label>
//                 <textarea
//                   id="card_address"
//                   rows={4}
//                   className="w-full rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
//                   value={profile?.address}
//                 />

//                 <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
//                   <div>
//                     <label
//                       htmlFor="expiry_date"
//                       className="mt-4 mb-2 block text-sm font-medium"
//                     >
//                       Nhập mã giảm giá
//                     </label>
//                     <div className="flex">
//                       <input
//                         type="text"
//                         id="expiry_date"
//                         className="w-full rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
//                         placeholder="ECOMXXXX"
//                       />
//                       <button
//                         type="button"
//                         className="ml-4 rounded-md bg-blue-500 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       >
//                         Check
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <button className="mt-8 w-full rounded-md bg-blue-500 py-3 text-white font-medium transition duration-200 hover:bg-blue-600">
//                 Thanh toán
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>

//       <ToastContainer />
//     </>
//   );
// };

// export default CheckoutPage;
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createOrderThunk } from "../../../../redux/order/orderThunks";
import { fetchCartById } from "../../../../redux/cart/cartThunk";
import { AppDispatch, RootState } from "../../../../redux/store";
import { Order } from "../../../../types/order/order";
import { useForm, SubmitHandler } from "react-hook-form";
import { useVNPay } from "../../../../hooks/vnpay";
import { CartItem } from "../../../../types/cart/carts";
import { Card } from "flowbite-react";
import { Radio, RadioGroup } from "@nextui-org/react";
import Swal from "sweetalert2";

type FormData = {
  payment: string;
  voucherCode: string;
};

const CheckoutPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const userId = useSelector(
    (state: RootState) => state.auth.profile.profile?._id
  );
  const address = useSelector((state: RootState) => state.auth.profile);
  const defaultAddress = address?.profile?.addresses.find(
    (address) => address.isDefault === true
  );

  const profile = useSelector((state: RootState) => state.auth.profile.profile);
  const carts = useSelector((state: RootState) => state.cart.carts);
  const { createPaymentUrl } = useVNPay();

  const [cart, setCart] = useState<any>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const { handleSubmit } = useForm<FormData>();
  const [selectedPayment, setSelectedPayment] = useState("");
  useEffect(() => {
    if (id) {
      dispatch(fetchCartById(id)).then((result) => {
        if (result.payload) {
          setCart(result.payload);
        }
      });
    }
  }, [dispatch, id]);

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
            // product: {
            //   ...item.product,
            //   product_attributes: item.product.product_attributes.map(
            //     (attr) => ({
            //       k: attr.k,
            //       v: attr.v,
            //     })
            //   ),
            // },
            product: {
              ...item.product,
              product_attributes: Array.isArray(item.product.product_attributes)
                ? item.product.product_attributes.map((attr) => ({
                    k: attr.k,
                    v: attr.v,
                  }))
                : [],
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

  // Xử lý sau khi VNPay trả về kết quả
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const paymentResult = query.get("paymentResult");
    const orderIdFromQuery = query.get("orderId");

    if (paymentResult === "success" && orderIdFromQuery) {
      setOrderId(orderIdFromQuery);
      handleOrderCreation(orderIdFromQuery);
    }
  }, [location.search]);

  const handleOrderCreation = async (orderId: string) => {
    if (!orderId) {
      toast.error("orderId không hợp lệ.");
      return;
    }
    if (!userId) {
      toast.error("Thông tin người dùng không hợp lệ.");
      return;
    }

    if (!address.profile?.addresses[0]) {
      Swal.fire({
        title: "Cập nhật địa chỉ",
        text: "Địa chỉ không hợp lệ. Bạn có muốn cập nhật địa chỉ không?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Cập nhật",
        cancelButtonText: "Hủy",
        customClass: {
          confirmButton:
            "bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded",
          cancelButton:
            "bg-gray-400 hover:bg-gray-500 text-white font-medium py-2 px-4 rounded",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/profile", { state: { view: "address" } });
        }
      });

      return;
    }

    const orderData = generateOrderData("vnPay", orderId);

    try {
      const response = await dispatch(createOrderThunk(orderData)).unwrap();
      toast.dismiss();
      const successMessage = response?.message || "Tạo đơn thành công!";
      toast.success(successMessage);

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Failed to create order:", error);
      toast.error(error as string);
    }
  };

  const handleCheckout: SubmitHandler<FormData> = async () => {
    if (!userId) {
      toast.error("Thông tin người dùng không hợp lệ.");
      return;
    }

    if (!address.profile?.addresses[0]) {
      Swal.fire({
        title: "Cập nhật địa chỉ",
        text: "Địa chỉ không hợp lệ. Bạn có muốn cập nhật địa chỉ không?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Cập nhật",
        cancelButtonText: "Hủy",
        customClass: {
          confirmButton:
            "bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded",
          cancelButton:
            "bg-gray-400 hover:bg-gray-500 text-white font-medium py-2 px-4 rounded",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/profile", { state: { view: "address" } });
        }
      });

      return;
    }
    if (!address.profile?.banks?.length) {
      Swal.fire({
        title: "Cập nhật ngân hàng",
        text: "Bạn chưa liên kết ngân hàng. Điều này là bắt buộc để thuận tiện cho việc hoàn tiền khi thanh toán bằng VNPay. Bạn có muốn cập nhật ngay không?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Cập nhật",
        cancelButtonText: "Hủy",
        customClass: {
          confirmButton:
            "bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded",
          cancelButton:
            "bg-gray-400 hover:bg-gray-500 text-white font-medium py-2 px-4 rounded",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/profile", { state: { view: "Bank" } });
        }
      });

      return;
    }

    if (!cart || cart.items.length === 0) {
      toast.error("Giỏ hàng trống.");
      return;
    }

    if (!selectedPayment) {
      toast.error("Chưa chọn phương thức thanh toán.");
      return;
    }

    const orderData = generateOrderData(selectedPayment);

    try {
      if (selectedPayment === "vnPay") {
        const paymentUrl = await createPaymentUrl(carts[0].totalPrice);
        if (paymentUrl) {
          window.location.href = paymentUrl;
        }
      } else {
        const response = await dispatch(createOrderThunk(orderData)).unwrap();
        setOrderId(orderId);
        toast.dismiss();
        const successMessage = response?.message || "Tạo đơn thành công!";
        toast.success(successMessage);

        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (error) {
      console.error("Failed to create order:", error);
      toast.error(error as string);
    }
  };

  return (
    <>
      <div>
        <form onSubmit={handleSubmit(handleCheckout)}>
          <div className="flex flex-col items-center border-b bg-white py-4 sm:flex-row sm:px-10 lg:px-20 xl:px-32">
            <a href="#" className="text-2xl font-bold text-gray-800">
              Thanh toán
            </a>
          </div>
          <div className="grid sm:px-10 lg:grid-cols-2 lg:px-20 xl:px-32">
            <div className="px-4 pt-8 min-h-[calc(85vh-10rem)]">
              <p className="text-xl font-medium">Lưu ý</p>
              <p className="text-gray-400">
                Vui lòng kiểm tra đầy đủ thông tin sản phẩm và địa chỉ.
              </p>
              {cart && Array.isArray(cart.items) && cart.items.length > 0 ? (
                <div>
                  {cart.items.map((item: any) => (
                    <div className="mt-8 space-y-3 rounded-lg border bg-white px-2 py-4 sm:px-6">
                      {/* Các sản phẩm trong đơn hàng */}

                      <div className="flex flex-col rounded-lg bg-white sm:flex-row">
                        <img
                          className="m-2 h-24 w-28 rounded-md border object-cover object-center"
                          src={item.productVariant?.image?.[0]?.image?.[0]}
                          alt={item.productVariant.variant_name}
                        />

                        <div className="flex w-full flex-col px-4 py-4">
                          <span className="font-semibold">
                            {item.productVariant.variant_name}
                          </span>
                          <span className="float-right text-gray-400">
                            Số lượng: {item.quantity}
                          </span>
                          <p className="mt-auto text-lg font-bold">
                            {" "}
                            {item.productVariant.variant_price.toLocaleString(
                              "vi-VN",
                              {
                                style: "currency",
                                currency: "VND",
                              }
                            )}{" "}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Giỏ hàng trống.</p>
              )}

              <div className="space-y-4">
                <Card>
                  <h4 className="text-md font-medium">Tổng giá trị đơn hàng</h4>
                  <p className="text-lg font-semibold">
                    {carts[0].items[0].totalItemPrice.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </p>
                </Card>
                {/* Other summary details can go here */}
              </div>

              {/* <p className="mt-8 text-lg font-medium">Phương thức thanh toán</p> */}
              {/* <div className="mt-5 grid gap-6">
                <div className="relative">
                  <input
                    className="peer hidden"
                    id="radio_1"
                    type="radio"
                    name="payment"
                    value="Thanh toán khi nhận hàng"
                    checked={selectedPayment === "Thanh toán khi nhận hàng"}
                    onChange={(e) => setSelectedPayment(e.target.value)}
                  />
                  <span className="peer-checked:border-gray-700 absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white"></span>
                  <label
                    className="peer-checked:border-2 peer-checked:border-gray-700 peer-checked:bg-gray-50 flex cursor-pointer select-none rounded-lg border border-gray-300 p-4"
                    htmlFor="radio_1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="50"
                      height="50"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M4.308 18.616q-.667 0-1.141-.475q-.475-.475-.475-1.141V8.692q0-.212.144-.356t.357-.144t.356.144t.143.356V17q0 .23.192.423q.193.193.424.193h13.538q.213 0 .356.143q.144.144.144.357t-.144.356t-.356.144zm3-3q-.667 0-1.141-.475q-.475-.475-.475-1.141V6.846q0-.666.475-1.14t1.14-.475h12.385q.667 0 1.141.474t.475 1.141V14q0 .666-.475 1.14q-.474.476-1.14.476zm1-1q0-.672-.475-1.144Q7.36 13 6.693 13v1q0 .25.182.433t.433.183zm10.384 0h1q.25 0 .433-.183t.183-.433v-1q-.672 0-1.144.475q-.472.474-.472 1.14M13.5 12.424q.846 0 1.423-.577t.577-1.423T14.923 9T13.5 8.423T12.077 9t-.577 1.423t.577 1.423t1.423.577M6.692 7.846q.672 0 1.144-.474q.472-.475.472-1.141h-1q-.25 0-.433.183t-.183.432zm13.616 0v-1q0-.25-.183-.432t-.433-.183h-1q0 .671.475 1.143q.474.472 1.14.472"
                      />
                    </svg>
                    <div className="ml-5">
                      <span className="mt-2 font-semibold">
                        Thanh toán khi nhận hàng
                      </span>
                      <p className="text-slate-500 text-sm leading-6">
                        Delivery: 2-4 Days
                      </p>
                    </div>
                  </label>
                </div>

                <div className="relative">
                  <input
                    className="peer hidden"
                    id="radio_2"
                    type="radio"
                    name="payment"
                    value="vnPay"
                    checked={selectedPayment === "vnPay"}
                    onChange={(e) => setSelectedPayment(e.target.value)}
                  />
                  <span className="peer-checked:border-gray-700 absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white"></span>
                  <label
                    className="peer-checked:border-2 peer-checked:border-gray-700 peer-checked:bg-gray-50 flex cursor-pointer select-none rounded-lg border border-gray-300 p-4"
                    htmlFor="radio_2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="50"
                      height="50"
                      viewBox="0 0 24 24"
                    >
                      <rect width="24" height="24" fill="none" />
                      <g fill="none">
                        <g clip-path="url(#grommetIconsSamsungPay0)">
                          <path
                            fill="#110404"
                            fill-rule="evenodd"
                            d="M21.33 2.688c1.395 1.48 2.192 3.502 2.477 5.723c.284 2.135.17 3.587.17 3.587s.086 1.452-.199 3.587c-.284 2.22-1.082 4.243-2.477 5.723c-1.48 1.395-3.502 2.192-5.722 2.477c-2.136.256-3.588.2-3.588.2s-1.451.084-3.587-.2c-2.22-.285-4.242-1.082-5.722-2.477c-1.395-1.48-2.193-3.502-2.477-5.723c-.257-2.135-.2-3.587-.2-3.587s-.057-1.452.228-3.587C.518 6.19 1.315 4.169 2.71 2.688C4.19 1.293 6.212.496 8.433.211C10.568-.045 12.02.012 12.02.012s1.452-.085 3.587.2c2.22.284 4.242 1.081 5.723 2.476M6.582 8.496H4.447v6.292h1.167v-1.793h.968c.342 0 .655-.058.911-.172s.513-.284.712-.483a2.1 2.1 0 0 0 .484-.712c.114-.285.17-.57.17-.883a2.3 2.3 0 0 0-.17-.882a2.1 2.1 0 0 0-.484-.712a2.1 2.1 0 0 0-.712-.484a2.4 2.4 0 0 0-.91-.17Zm-.996 3.388V9.55h.91c.172 0 .342.028.485.085a1.1 1.1 0 0 1 .37.256c.085.114.17.228.228.37c.057.143.085.285.085.456c0 .17-.028.313-.085.456a1.08 1.08 0 0 1-.598.626a1.3 1.3 0 0 1-.484.085zm5.067 2.733c.314.114.598.171.912.171c.341 0 .626-.057.91-.171c.285-.142.542-.313.712-.541v.712h1.168V9.72h-1.168v.655c-.199-.2-.427-.37-.711-.484a2.3 2.3 0 0 0-.912-.17c-.341 0-.626.056-.939.17c-.285.114-.57.256-.797.484a2.7 2.7 0 0 0-.57.797c-.142.313-.199.684-.199 1.082c0 .399.086.769.228 1.082s.342.57.57.797c.227.2.512.37.796.484m1.709-.996c-.171.085-.37.114-.598.114a1.9 1.9 0 0 1-.598-.114l-.004-.002c-.17-.085-.339-.17-.48-.311a3 3 0 0 1-.313-.484a1.3 1.3 0 0 1-.114-.57c0-.199.028-.398.114-.569c.057-.17.17-.313.313-.456a1.4 1.4 0 0 1 .484-.313c.2-.085.399-.114.598-.114c.2 0 .398.029.598.143c.199.085.341.17.484.313c.142.114.227.285.313.456c.085.17.114.37.114.569s-.029.398-.114.57a1.6 1.6 0 0 1-.313.455c-.143.142-.313.228-.484.313m5.039-.427l-1.424-3.445h-1.224l2.05 4.812l-1.053 2.533h1.195l2.99-7.345H18.71z"
                            clip-rule="evenodd"
                          />
                        </g>
                        <defs>
                          <clipPath id="grommetIconsSamsungPay0">
                            <path fill="#fff" d="M0 0h24v24H0z" />
                          </clipPath>
                        </defs>
                      </g>
                    </svg>
                    <div className="ml-5">
                      <span className="mt-2 font-semibold">
                        Thanh Toán VnPay
                      </span>
                      <p className="text-slate-500 text-sm leading-6">
                        Delivery: 2-4 Days
                      </p>
                    </div>
                  </label>
                </div>
              </div> */}
              <div className="mt-5">
                <RadioGroup
                  label="Phương thức thanh toán"
                  value={selectedPayment}
                  onChange={(e) => setSelectedPayment(e.target.value)}
                >
                  <div className="space-y-4">
                    <Radio
                      value="Thanh toán khi nhận hàng"
                      aria-label="Thanh toán khi nhận hàng"
                    >
                      <div className="flex items-center">
                        <img
                          src="https://firebasestorage.googleapis.com/v0/b/xprojreact.appspot.com/o/logo%2Fcash.png?alt=media&token=ecd7d9a0-342a-4dd9-b712-dffdab256441"
                          alt="VnPay"
                          width="50"
                          height="50"
                          className="object-contain"
                        />
                        <div className="ml-5">
                          <span className="font-semibold">
                            Thanh toán khi nhận hàng
                          </span>
                          <p className="text-slate-500 text-sm leading-6">
                            Giao hàng: Dự kiến trong 2-4 ngày làm việc, tùy
                            thuộc vào địa chỉ của bạn.
                          </p>
                        </div>
                      </div>
                    </Radio>

                    <Radio value="vnPay" aria-label="vnPay">
                      <div className="flex items-center">
                        <img
                          src="https://firebasestorage.googleapis.com/v0/b/xprojreact.appspot.com/o/logo%2Fvnpay.png?alt=media&token=d894f968-8e29-4897-a2ac-c80bba0e00f1"
                          alt="VnPay"
                          width="50"
                          height="50"
                          className="object-contain"
                        />

                        <div className="ml-5">
                          <span className="font-semibold">
                            Thanh Toán VnPay
                          </span>
                          <p className="text-slate-500 text-sm leading-6">
                            Giao hàng: Dự kiến trong 2-4 ngày làm việc, tùy
                            thuộc vào địa chỉ của bạn.
                          </p>
                        </div>
                      </div>
                    </Radio>
                  </div>
                </RadioGroup>
              </div>
            </div>
            <div className="mt-10 bg-gray-50 px-4 pt-8 lg:mt-0 min-h-[calc(65vh-10rem)]">
              <p className="text-xl font-medium">Thông Tin Nhận Hàng</p>

              <div className="">
                <label
                  htmlFor="text"
                  className="mt-4 mb-2 block text-sm font-medium"
                >
                  Họ tên
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="text"
                    name="text"
                    className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                    value={defaultAddress?.fullName}
                    readOnly
                  />
                  <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                    <i className="iconify mdi--account-payment w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white "></i>
                  </div>
                </div>
                {/* sdt */}
                <label
                  htmlFor="text"
                  className="mt-4 mb-2 block text-sm font-medium"
                >
                  Số điện thoại
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="text"
                    name="text"
                    className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                    value={defaultAddress?.phone}
                    readOnly
                  />
                  <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                    <i className="iconify mdi--phone w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white "></i>
                  </div>
                </div>
                {/* home */}
                <label
                  htmlFor="card_address"
                  className="mt-4 mb-2 block text-sm font-medium"
                >
                  Địa chỉ
                </label>
                <textarea
                  id="card_address"
                  rows={4}
                  className="w-full rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                  value={defaultAddress?.address}
                  readOnly
                />

                {/* <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="expiry_date"
                      className="mt-4 mb-2 block text-sm font-medium"
                    >
                      Nhập mã giảm giá
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        id="expiry_date"
                        className="w-full rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="ECOMXXXX"
                      />
                      <Button
                        type="button"
                        className="ml-4 rounded-md bg-blue-500 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        Check
                      </Button>
                    </div>
                  </div>
                </div> */}
              </div>
              <button className="mt-8 w-full rounded-md bg-blue-500 py-3 text-white font-medium transition duration-200 hover:bg-blue-600">
                Thanh toán
              </button>
            </div>
          </div>
        </form>
      </div>

      <ToastContainer />
    </>
  );
};

export default CheckoutPage;
