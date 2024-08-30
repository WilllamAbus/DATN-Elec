// import React, { useEffect, useState } from "react";
// import { useForm, Controller, SubmitHandler } from "react-hook-form";
// import { CartItem, CartState } from "../../../../types/Voucher.d";
// import "../../../../assets/css/user.style.css";
// import "@fortawesome/fontawesome-free/css/all.min.css";
// import { useNavigate, useLocation } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";
// import { useDispatch } from "react-redux";
// import { addOrderThunk } from "../../../../redux/checkout/checkoutThunk";
// import { AppDispatch } from "../../../../redux/store";
// import { SanboxPayment } from "../../../../services/pay/sanboxPayment";
// import { calculateSignature } from "../../../../services/pay/signature";
// import { Button, Label, Select, TextInput, Card } from "flowbite-react";
// // Implement signatureService
// const signatureService = {
//   calculateSignature,
// };

// // Create an instance of SanboxPayment
// const paymentService = new SanboxPayment(signatureService);

// interface DecodedToken {
//   id: string;
//   email: string;
// }

// const decodeToken = (token: string): DecodedToken => {
//   try {
//     const decoded: any = jwtDecode(token);
//     return {
//       id: decoded.id || "",
//       email: decoded.email || "",
//     };
//   } catch (error) {
//     console.error("Failed to decode token:", error);
//     return { id: "", email: "" };
//   }
// };

// interface FormValues {
//   name: string;
//   address: string;
//   city: string;
//   phone: string;
//   payment: string;
// }

// const Checkout: React.FC = () => {
//   const {
//     control,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm<FormValues>({
//     defaultValues: {
//       name: "",
//       address: "",
//       city: "",
//       phone: "",
//       payment: "",
//     },
//   });

//   const [cartState, setCartState] = useState<CartState>({
//     items: [],
//     totalPrice: 0,
//     shipping: 0,
//     applyVoucher: false,
//     selectedVoucher: undefined,
//   });

//   const [grandTotal, setGrandTotal] = useState<number>(0);
//   const [, setVoucher] = useState<{
//     code: string;
//     discount: number;
//   } | null>(null);
//   const navigate = useNavigate();
//   const dispatch = useDispatch<AppDispatch>();

//   const location = useLocation();
//   const { groupedCarts, totalCartPrice } = location.state as {
//     groupedCarts: CartItem[];
//     totalCartPrice: number;
//   };

//   useEffect(() => {
//     // Update cart state with data from location
//     if (groupedCarts) {
//       setCartState((prevState) => ({
//         ...prevState,
//         items: groupedCarts,
//         totalPrice: calculateTotalPrice(groupedCarts),
//       }));
//     }

//     if (totalCartPrice) {
//       setGrandTotal(totalCartPrice);
//     }

//     const storedVoucher = JSON.parse(
//       localStorage.getItem("selectedVoucher") || "null"
//     );
//     if (storedVoucher) {
//       setVoucher({
//         code: storedVoucher.code,
//         discount: storedVoucher.voucherNum,
//       });
//     }
//   }, [groupedCarts, totalCartPrice]);

//   const getUserData = (): DecodedToken => {
//     const userData = window.localStorage.getItem("persist:root");

//     if (userData) {
//       try {
//         const parsedData = JSON.parse(userData);
//         const loginData = JSON.parse(parsedData.auth)?.login;

//         if (loginData && loginData.token) {
//           const token = loginData.token;
//           return decodeToken(token);
//         }
//       } catch (error) {
//         console.error("Failed to parse user data:", error);
//       }
//     }

//     return { id: "", email: "" };
//   };

//   const calculateCartTotals = (items: CartItem[]) => {
//     const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
//     return { totalQuantity };
//   };

//   const calculateTotalPrice = (items: CartItem[]): number => {
//     return items.reduce((total, item) => total + item.price * item.quantity, 0);
//   };

//   const handleCheckout: SubmitHandler<FormValues> = async (data) => {
//     localStorage.setItem("cart", JSON.stringify(cartState.items));
//     const userData = getUserData();
//     const { totalQuantity } = calculateCartTotals(cartState.items);

//     const orderData = {
//       payment: {
//         method: data.payment,
//         details: "123456789",
//       },
//       quantityShopping: totalQuantity,
//       totalPrice: grandTotal,
//       userId: [{ user: userData.id, email: userData.email }],
//       products: cartState.items.map((item) => ({
//         product: item.id,
//         name: item.name,
//       })),
//       shipping: {
//         name: data.name,
//         address: data.address,
//         city: data.city,
//         sdt: data.phone,
//         formatShipping: {
//           type: "standard",
//           price: 25000,
//         },
//       },
//       status: "active",
//     };

//     console.log("Order data:", orderData);

//     try {
//       await dispatch(addOrderThunk(orderData)).unwrap();
//       if (data.payment === "momo") {
//         await paymentService.processMoMoPaymentWithRetry();
//       } else {
//         navigate("/complete");
//       }
//       reset(); // Reset the form after successful submission
//     } catch (error) {
//       console.error("Error processing order:", error);
//       // Optional: show an error message to the user
//     }
//   };

//   return (
//     <>
//       {/* Breadcrumb */}
//       <div className="container py-4 flex items-center gap-3">
//         <a href="/" className="text-primary text-base">
//           <i className="fa-solid fa-house"></i>
//         </a>
//         <span className="text-sm text-gray-400">
//           <i className="fa-solid fa-chevron-right"></i>
//         </span>
//         <p className="text-gray-600 font-medium">Checkout</p>
//       </div>

//       {/* Wrapper */}
//       <div className="container grid grid-cols-12 items-start pb-16 pt-4 gap-6">
//         <div className="col-span-8 border border-gray-200 p-4 rounded-lg">
//           <h3 className="text-lg font-medium capitalize mb-4">Checkout</h3>
//           <div className="space-y-4">
//             <form onSubmit={handleSubmit(handleCheckout)}>
//               <div>
//                 <Label htmlFor="name" value="Tên người nhận" />
//                 <Controller
//                   name="name"
//                   control={control}
//                   rules={{
//                     required: "Tên người nhận không được để trống",
//                     minLength: {
//                       value: 3,
//                       message: "Độ dài phải có ít nhất 3 kí tự",
//                     },
//                     validate: {
//                       noNumbers: (value) =>
//                         !/\d/.test(value) ||
//                         "Tên người nhận không được chứa số",
//                     },
//                   }}
//                   render={({ field }) => <TextInput {...field} id="name" />}
//                 />
//                 {errors.name && (
//                   <span className="text-red-600">{errors.name.message}</span>
//                 )}
//               </div>
//               <br />
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <Label htmlFor="address" value="Địa chỉ" />
//                   <Controller
//                     name="address"
//                     control={control}
//                     rules={{
//                       required: "Địa chỉ không được để trống",
//                       minLength: {
//                         value: 3,
//                         message: "Độ dài phải có ít nhất 3 kí tự",
//                       },
//                     }}
//                     render={({ field }) => (
//                       <TextInput {...field} id="address" />
//                     )}
//                   />
//                   {errors.address && (
//                     <span className="text-red-600">
//                       {errors.address.message}
//                     </span>
//                   )}
//                 </div>
//                 <div>
//                   <Label htmlFor="city" value="Thành Phố" />
//                   <Controller
//                     name="city"
//                     control={control}
//                     rules={{ required: "Thành phố không được bỏ trống" }}
//                     render={({ field }) => (
//                       <Select {...field} id="city">
//                         <option value="">Chọn thành phố</option>
//                         <option value="Cần Thơ">Cần Thơ</option>
//                         <option value="Hồ Chí Minh">Hồ Chí Minh</option>
//                         <option value="Đà Nẵng">Đà Nẵng</option>
//                         <option value="Hải Phòng">Hải Phòng</option>
//                       </Select>
//                     )}
//                   />
//                   {errors.city && (
//                     <span className="text-red-600">{errors.city.message}</span>
//                   )}
//                 </div>
//               </div>
//               <br />
//               <div>
//                 <Label htmlFor="phone" value="SĐT" />
//                 <Controller
//                   name="phone"
//                   control={control}
//                   rules={{
//                     required: "Sđt không được để trống",
//                     pattern: {
//                       value: /^[0-9]+$/,
//                       message: "Sđt không hợp lệ",
//                     },
//                   }}
//                   render={({ field }) => <TextInput {...field} id="phone" />}
//                 />
//                 {errors.phone && (
//                   <span className="text-red-600">{errors.phone.message}</span>
//                 )}
//               </div>
//               <br />
//               <div>
//                 <Label htmlFor="payment" value="Phương thức thanh toán" />
//                 <Controller
//                   name="payment"
//                   control={control}
//                   rules={{ required: "Vui lòng chọn phương thức thanh toán" }}
//                   render={({ field }) => (
//                     <Select {...field} id="payment">
//                       <option value="">Chọn phương thức</option>
//                       <option value="creditCard">Thẻ tín dụng</option>
//                       <option value="momo">MoMo</option>
//                     </Select>
//                   )}
//                 />
//                 {errors.payment && (
//                   <span className="text-red-600">{errors.payment.message}</span>
//                 )}
//               </div>
//               <br />
//               <Button
//                 type="submit"
//                 className="bg-blue-600 text-white hover:bg-primary-dark focus:ring-primary-light"
//               >
//                 Đặt hàng
//               </Button>
//             </form>
//           </div>
//         </div>
//         <div className="col-span-4 border border-gray-200 p-4 rounded-lg">
//           <h3 className="text-lg font-medium capitalize mb-4">Giỏ hàng</h3>
//           <div className="space-y-4">
//             <Card>
//               <h4 className="text-md font-medium">Tổng giá trị đơn hàng</h4>
//               <p className="text-lg font-semibold">
//                 {grandTotal.toLocaleString("vi-VN", {
//                   style: "currency",
//                   currency: "VND",
//                 })}
//               </p>
//             </Card>
//             {/* Other summary details can go here */}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Checkout;
// import React, { useEffect, useState } from "react";
// import { useForm, Controller, SubmitHandler } from "react-hook-form";
// import { CartItem, CartState } from "../../../../types/Voucher.d";
// import "../../../../assets/css/user.style.css";
// import "@fortawesome/fontawesome-free/css/all.min.css";
// import { useNavigate, useLocation } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";
// import { useDispatch, useSelector } from "react-redux";
// import { addOrderThunk } from "../../../../redux/checkout/checkoutThunk";
// import { AppDispatch, RootState } from "../../../../redux/store";
// import { SanboxPayment } from "../../../../services/pay/sanboxPayment";
// import { calculateSignature } from "../../../../services/pay/signature";
// import { Button, Label, Select, Card } from "flowbite-react";
// import { createOrderThunk, VnPaymentThunk } from "../../../../redux/pay/vnpay";
// // Implement signatureService
// const signatureService = {
//   calculateSignature,
// };

// // Create an instance of SanboxPayment
// const paymentService = new SanboxPayment(signatureService);

// interface DecodedToken {
//   id: string;
//   email: string;
// }

// const decodeToken = (token: string): DecodedToken => {
//   try {
//     const decoded: any = jwtDecode(token);
//     return {
//       id: decoded.id || "",
//       email: decoded.email || "",
//     };
//   } catch (error) {
//     console.error("Failed to decode token:", error);
//     return { id: "", email: "" };
//   }
// };

// interface FormValues {
//   name: string;
//   address: string;
//   city: string;
//   phone: string;
//   payment: string;
// }

// const Checkout: React.FC = () => {
//   const {
//     control,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm<FormValues>({
//     defaultValues: {
//       name: "",
//       address: "",
//       city: "",
//       phone: "",
//       payment: "",
//     },
//   });

//   const [cartState, setCartState] = useState<CartState>({
//     items: [],
//     totalPrice: 0,
//     shipping: 0,
//     applyVoucher: false,
//     selectedVoucher: undefined,
//   });

//   const [grandTotal, setGrandTotal] = useState<number>(0);
//   const [, setVoucher] = useState<{
//     code: string;
//     discount: number;
//   } | null>(null);
//   const navigate = useNavigate();
//   const dispatch = useDispatch<AppDispatch>();
//   const location = useLocation();

//   // Lấy thông tin người dùng từ Redux store
//   const profile = useSelector((state: RootState) => state.auth.profile.profile);
//   console.log(profile);

//   const { groupedCarts, totalCartPrice } = location.state as {
//     groupedCarts: CartItem[];
//     totalCartPrice: number;
//   };

//   useEffect(() => {
//     // Update cart state with data from location
//     if (groupedCarts) {
//       setCartState((prevState) => ({
//         ...prevState,
//         items: groupedCarts,
//         totalPrice: calculateTotalPrice(groupedCarts),
//       }));
//     }

//     if (totalCartPrice) {
//       setGrandTotal(totalCartPrice);
//     }

//     const storedVoucher = JSON.parse(
//       localStorage.getItem("selectedVoucher") || "null"
//     );
//     if (storedVoucher) {
//       setVoucher({
//         code: storedVoucher.code,
//         discount: storedVoucher.voucherNum,
//       });
//     }
//   }, [groupedCarts, totalCartPrice]);

//   const getUserData = (): DecodedToken => {
//     const userData = window.localStorage.getItem("persist:root");

//     if (userData) {
//       try {
//         const parsedData = JSON.parse(userData);
//         const loginData = JSON.parse(parsedData.auth)?.login;

//         if (loginData && loginData.token) {
//           const token = loginData.token;
//           return decodeToken(token);
//         }
//       } catch (error) {
//         console.error("Failed to parse user data:", error);
//       }
//     }

//     return { id: "", email: "" };
//   };

//   const calculateCartTotals = (items: CartItem[]) => {
//     const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
//     return { totalQuantity };
//   };

//   const calculateTotalPrice = (items: CartItem[]): number => {
//     return items.reduce((total, item) => total + item.price * item.quantity, 0);
//   };

//   const handleCheckout: SubmitHandler<FormValues> = async (data) => {
//     localStorage.setItem("cart", JSON.stringify(cartState.items));
//     const userData = getUserData();
//     const { totalQuantity } = calculateCartTotals(cartState.items);

//     const orderData = {
//       payment: {
//         method: data.payment,
//         details: "123456789",
//       },
//       quantityShopping: totalQuantity,
//       totalPrice: grandTotal,
//       userId: [{ user: userData.id, email: userData.email }],
//       products: cartState.items.map((item) => ({
//         product: item.id,
//         name: item.name,
//       })),
//       shipping: {
//         name: data.name,
//         address: data.address,
//         city: data.city,
//         sdt: data.phone,
//         formatShipping: {
//           type: "standard",
//           price: 25000,
//         },
//       },
//       status: "active",
//     };

//     console.log("Order data:", orderData);

//     try {
//       await dispatch(addOrderThunk(orderData)).unwrap();
//       if (data.payment === "momo") {
//         await paymentService.processMoMoPaymentWithRetry();
//       } else {
//         navigate("/complete");
//       }
//       reset(); // Reset the form after successful submission
//     } catch (error) {
//       console.error("Error processing order:", error);
//       // Optional: show an error message to the user
//     }
//   };

//   return (
//     <>
//       {/* Breadcrumb */}
//       <div className="container py-4 flex items-center gap-3">
//         <a href="/" className="text-primary text-base">
//           <i className="fa-solid fa-house"></i>
//         </a>
//         <span className="text-sm text-gray-400">
//           <i className="fa-solid fa-chevron-right"></i>
//         </span>
//         <p className="text-gray-600 font-medium">Checkout</p>
//       </div>

//       {/* Wrapper */}
//       <div className="container grid grid-cols-12 items-start pb-16 pt-4 gap-6">
//         <div className="col-span-8 border border-gray-200 p-4 rounded-lg">
//           <h3 className="text-lg font-medium capitalize mb-4">Checkout</h3>
//           <div className="space-y-4">
//             <form onSubmit={handleSubmit(handleCheckout)}>
//               <div>
//                 <Label htmlFor="name" value="Tên người nhận" />
//                 <input
//                   type="text"
//                   id="name"
//                   value={profile?.name || ""}
//                   readOnly
//                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                 />
//               </div>
//               <br />
//               <div className="space-y-4">
//                 <div>
//                   <Label htmlFor="address" value="Địa chỉ" />
//                   <input
//                     type="text"
//                     id="address"
//                     value={profile?.address || ""}
//                     readOnly
//                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                   />
//                 </div>
//                 {/* <div>
//                 <Label htmlFor="city" value="Thành Phố" />
//                 <Controller
//                   name="city"
//                   control={control}
//                   defaultValue={profile?.city || ""}
//                   render={({ field }) => (
//                     <Select {...field} id="city">
//                       <option value="">Chọn thành phố</option>
//                       <option value="Cần Thơ">Cần Thơ</option>
//                       <option value="Hồ Chí Minh">Hồ Chí Minh</option>
//                       <option value="Đà Nẵng">Đà Nẵng</option>
//                       <option value="Hải Phòng">Hải Phòng</option>
//                     </Select>
//                   )}
//                 />
//               </div> */}
//               </div>
//               <br />
//               <div>
//                 <Label htmlFor="phone" value="SĐT" />
//                 <input
//                   type="text"
//                   id="phone"
//                   value={profile?.phone || ""}
//                   readOnly
//                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                 />
//               </div>
//               <br />
//               <div>
//                 <Label htmlFor="payment" value="Phương thức thanh toán" />
//                 <Controller
//                   name="payment"
//                   control={control}
//                   render={({ field }) => (
//                     <Select {...field} id="payment">
//                       <option value="">Chọn phương thức</option>
//                       <option value="creditCard">Thẻ tín dụng</option>
//                       <option value="momo">MoMo</option>
//                       <option value="momo">VNPay</option>
//                     </Select>
//                   )}
//                 />
//                 {errors.payment && (
//                   <span className="text-red-600">{errors.payment.message}</span>
//                 )}
//               </div>
//               <br />
//               <Button
//                 type="submit"
//                 className="bg-blue-600 text-white hover:bg-primary-dark focus:ring-primary-light"
//                 // disabled={isSubmitting}
//               >
//                 Đặt hàng
//               </Button>
//             </form>
//           </div>
//         </div>
//         <div className="col-span-4 border border-gray-200 p-4 rounded-lg">
//           <h3 className="text-lg font-medium capitalize mb-4">Giỏ hàng</h3>
//           <div className="space-y-4">
//             <Card>
//               <h4 className="text-md font-medium">Tổng giá trị đơn hàng</h4>
//               <p className="text-lg font-semibold">
//                 {grandTotal.toLocaleString("vi-VN", {
//                   style: "currency",
//                   currency: "VND",
//                 })}
//               </p>
//             </Card>
//             {/* Other summary details can go here */}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Checkout;
import React, { useEffect, useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { CartItem, CartState } from "../../../../types/Voucher.d";
import "../../../../assets/css/user.style.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { addOrderThunk } from "../../../../redux/checkout/checkoutThunk";
import { AppDispatch, RootState } from "../../../../redux/store";
import { SanboxPayment } from "../../../../services/pay/sanboxPayment";
import { calculateSignature } from "../../../../services/pay/signature";
import { Button, Label, Select, Card } from "flowbite-react";
import useVnPay from "../../../../hooks/vnpay";

// Implement signatureService
const signatureService = {
  calculateSignature,
};

// Create an instance of SanboxPayment
const paymentService = new SanboxPayment(signatureService);

interface DecodedToken {
  id: string;
  email: string;
}

const decodeToken = (token: string): DecodedToken => {
  try {
    const decoded: any = jwtDecode(token);
    return {
      id: decoded.id || "",
      email: decoded.email || "",
    };
  } catch (error) {
    console.error("Failed to decode token:", error);
    return { id: "", email: "" };
  }
};

interface FormValues {
  name: string;
  address: string;
  city: string;
  phone: string;
  payment: string;
}

const Checkout: React.FC = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      address: "",
      city: "",
      phone: "",
      payment: "",
    },
  });

  const [cartState, setCartState] = useState<CartState>({
    items: [],
    totalPrice: 0,
    shipping: 0,
    applyVoucher: false,
    selectedVoucher: undefined,
  });

  const [grandTotal, setGrandTotal] = useState<number>(0);
  const [, setVoucher] = useState<{
    code: string;
    discount: number;
  } | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();

  // Use custom hook
  const { handleVnPayPayment, loading, error, success } = useVnPay();

  // Lấy thông tin người dùng từ Redux store
  const profile = useSelector((state: RootState) => state.auth.profile.profile);
  console.log(profile);

  const { groupedCarts, totalCartPrice } = location.state as {
    groupedCarts: CartItem[];
    totalCartPrice: number;
  };

  useEffect(() => {
    if (groupedCarts) {
      setCartState((prevState) => ({
        ...prevState,
        items: groupedCarts,
        totalPrice: calculateTotalPrice(groupedCarts),
      }));
    }

    if (totalCartPrice) {
      setGrandTotal(totalCartPrice);
    }

    const storedVoucher = JSON.parse(
      localStorage.getItem("selectedVoucher") || "null"
    );
    if (storedVoucher) {
      setVoucher({
        code: storedVoucher.code,
        discount: storedVoucher.voucherNum,
      });
    }
  }, [groupedCarts, totalCartPrice]);

  const getUserData = (): DecodedToken => {
    const userData = window.localStorage.getItem("persist:root");

    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        const loginData = JSON.parse(parsedData.auth)?.login;

        if (loginData && loginData.token) {
          const token = loginData.token;
          return decodeToken(token);
        }
      } catch (error) {
        console.error("Failed to parse user data:", error);
      }
    }

    return { id: "", email: "" };
  };

  const calculateCartTotals = (items: CartItem[]) => {
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    return { totalQuantity };
  };

  const calculateTotalPrice = (items: CartItem[]): number => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckout: SubmitHandler<FormValues> = async (data) => {
    localStorage.setItem("cart", JSON.stringify(cartState.items));
    const userData = getUserData();
    const { totalQuantity } = calculateCartTotals(cartState.items);

    const orderData = {
      payment: {
        method: data.payment,
        details: "123456789",
      },
      quantityShopping: totalQuantity,
      totalPrice: grandTotal,
      userId: [{ user: userData.id, email: userData.email }],
      products: cartState.items.map((item) => ({
        product: item.id,
        name: item.name,
      })),
      shipping: {
        name: data.name,
        address: data.address,
        city: data.city,
        sdt: data.phone,
        formatShipping: {
          type: "standard",
          price: 25000,
        },
      },
      status: "active",
    };

    console.log("Order data:", orderData);

    try {
      await dispatch(addOrderThunk(orderData)).unwrap();
      if (data.payment === "momo") {
        await paymentService.processMoMoPaymentWithRetry();
      } else if (data.payment === "vnPay") {
        await handleVnPayPayment();
      } else {
        navigate("/complete");
      }
      reset(); // Reset the form after successful submission
    } catch (error) {
      console.error("Error processing order:", error);
      // Optional: show an error message to the user
    }
  };

  return (
    <>
      {/* Breadcrumb */}
      <div className="container py-4 flex items-center gap-3">
        <a href="/" className="text-primary text-base">
          <i className="fa-solid fa-house"></i>
        </a>
        <span className="text-sm text-gray-400">
          <i className="fa-solid fa-chevron-right"></i>
        </span>
        <p className="text-gray-600 font-medium">Checkout</p>
      </div>

      {/* Wrapper */}
      <div className="container grid grid-cols-12 items-start pb-16 pt-4 gap-6">
        <div className="col-span-8 border border-gray-200 p-4 rounded-lg">
          <h3 className="text-lg font-medium capitalize mb-4">Checkout</h3>
          <div className="space-y-4">
            <form onSubmit={handleSubmit(handleCheckout)}>
              <div>
                <Label htmlFor="name" value="Tên người nhận" />
                <input
                  type="text"
                  id="name"
                  value={profile?.name || ""}
                  readOnly
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <br />
              <div className="space-y-4">
                <div>
                  <Label htmlFor="address" value="Địa chỉ" />
                  <input
                    type="text"
                    id="address"
                    value={profile?.address || ""}
                    readOnly
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                {/* <div>
                <Label htmlFor="city" value="Thành Phố" />
                <Controller
                  name="city"
                  control={control}
                  defaultValue={profile?.city || ""}
                  render={({ field }) => (
                    <Select {...field} id="city">
                      <option value="">Chọn thành phố</option>
                      <option value="Cần Thơ">Cần Thơ</option>
                      <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                      <option value="Đà Nẵng">Đà Nẵng</option>
                      <option value="Hải Phòng">Hải Phòng</option>
                    </Select>
                  )}
                />
              </div> */}
              </div>
              <br />
              <div>
                <Label htmlFor="phone" value="SĐT" />
                <input
                  type="text"
                  id="phone"
                  value={profile?.phone || ""}
                  readOnly
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <br />
              <div>
                <Label htmlFor="payment" value="Phương thức thanh toán" />
                <Controller
                  name="payment"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} id="payment">
                      <option value="">Chọn phương thức</option>
                      <option value="creditCard">Thẻ tín dụng</option>
                      <option value="momo">MoMo</option>
                      <option value="vnPay">VNPay</option>
                    </Select>
                  )}
                />
                {errors.payment && (
                  <span className="text-red-600">{errors.payment.message}</span>
                )}
              </div>
              <br />
              <Button
                type="submit"
                className="bg-blue-600 text-white hover:bg-primary-dark focus:ring-primary-light"
                disabled={loading}
              >
                {loading ? "Đang xử lý..." : "Đặt hàng"}
              </Button>
              {error && <p className="text-red-600 mt-2">{error}</p>}
              {success && (
                <p className="text-green-600 mt-2">Thanh toán thành công!</p>
              )}
            </form>
          </div>
        </div>
        <div className="col-span-4 border border-gray-200 p-4 rounded-lg">
          <h3 className="text-lg font-medium capitalize mb-4">Giỏ hàng</h3>
          <div className="space-y-4">
            <Card>
              <h4 className="text-md font-medium">Tổng giá trị đơn hàng</h4>
              <p className="text-lg font-semibold">
                {grandTotal.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </p>
            </Card>
            {/* Other summary details can go here */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
