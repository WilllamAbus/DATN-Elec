import React, { useEffect, useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { CartItem, CartState } from "../../../../types/Voucher.d";
import "../../../../assets/css/user.style.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import listOne from "../../../../assets/images/products/product14.jpg";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';

import { useDispatch } from "react-redux";
import { addOrderThunk } from "../../../../redux/checkout/checkoutThunk";
import { AppDispatch } from "../../../../redux/store";
import { SanboxPayment } from "../../../../services/pay/sanboxPayment";
import { calculateSignature } from "../../../../services/pay/signature";

// Implement signatureService
const signatureService = {
  calculateSignature,
};

// Create an instance of SanboxPayment
const paymentService = new SanboxPayment(signatureService);
// Implement signatureService
interface DecodedToken {
  id: string;
  email: string;
}

const decodeToken = (token: string): DecodedToken => {
    try {
      // Decode the JWT token
      const decoded: any = jwtDecode(token);
      return {
        id: decoded.id || "",
        email: decoded.email || ""
      };
    } catch (error) {
      console.error("Failed to decode token:", error);
      return { id: "", email: "" };
    }
  };

// Now you can call processMoMoPaymentWithRetry on paymentService
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
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const getUserData = (): DecodedToken => {
    const userData = window.localStorage.getItem("persist:root");
   
  
    if (userData) {
      try {
        // Parse the root state
        const parsedData = JSON.parse(userData);
    
  
        // Access the login data from parsedData
        const loginData = JSON.parse(parsedData.auth)?.login;
    
  
        // Check if loginData and token are available
        if (loginData && loginData.token) {
          const token = loginData.token;
         
  
          // Decode the token and return the result
          return decodeToken(token);
        }
      } catch (error) {
        console.error("Failed to parse user data:", error);
      }
    }
  
    // Return default value if data is not available or error occurs
    return { id: "", email: "" };
  };
  

  const calculateCartTotals = (items: CartItem[]) => {
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    return { totalQuantity, totalPrice };
  };

  useEffect(() => {
    // Retrieve cart items from localStorage
    const storedCartItems = localStorage.getItem("cart");
    if (storedCartItems) {
      const items: CartItem[] = JSON.parse(storedCartItems);
      setCartState((prevState) => ({
        ...prevState,
        items,
        totalPrice: calculateTotalPrice(items), // Calculate total price if needed
      }));
    }
  }, []);

  const calculateTotalPrice = (items: CartItem[]): number => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };
  const handleCheckout: SubmitHandler<FormValues> = async (data) => {
    localStorage.setItem("cart", JSON.stringify(cartState.items));
    const userData = getUserData();
    console.log("User data: ", userData);

    const { totalQuantity, totalPrice } = calculateCartTotals(cartState.items);

    const orderData = {
      payment: {
        method: data.payment,
        details: "123456789", // Add payment details as needed
      },
      quantityShopping: totalQuantity,
      totalPrice: totalPrice,
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
          price: 0,
        },
      },
      status: "active",
    };
    console.log('Order data:', orderData);
    
    try {
      await dispatch(addOrderThunk(orderData)).unwrap();
      if (data.payment === "momo") {
        await paymentService.processMoMoPaymentWithRetry();
      } else {
        navigate("/complete");
      }
      reset(); // Reset the form after successful submission
    } catch (error) {
      console.error("Error processing order:", error);
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
        <div className="col-span-8 border border-gray-200 p-4 rounded">
          <h3 className="text-lg font-medium capitalize mb-4">Checkout</h3>
          <div className="space-y-4">
            <form>
              {/* Form fields */}
              <div>
                <label className="text-gray-600">
                  Tên người nhận <span className="text-primary">*</span>
                </label>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <input {...field} className="input-box" />
                  )}
                />
                {errors.name && (
                  <span className="text-red-500">{errors.name.message}</span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-600">Địa chỉ</label>
                  <Controller
                    name="address"
                    control={control}
                    render={({ field }) => (
                      <input {...field} className="input-box" />
                    )}
                  />
                  {errors.address && (
                    <span className="text-red-500">
                      {errors.address.message}
                    </span>
                  )}
                </div>
                <div>
                  <label className="text-gray-600">Thành Phố</label>
                  <Controller
                    name="city"
                    control={control}
                    rules={{ required: "City is required" }}
                    render={({ field }) => (
                      <select {...field} className="input-box">
                        <option value="">Select a city</option>
                        <option value="Cần Thơ">Cần Thơ</option>
                        <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                        <option value="Đà Nẵng">Đà Nẵng</option>
                        <option value="Hải Phòng">Hải Phòng</option>
                      </select>
                    )}
                  />
                  {errors.city && (
                    <span className="text-red-500">{errors.city.message}</span>
                  )}
                </div>
              </div>
              <div>
                <label className="text-gray-600">SĐT</label>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <input {...field} className="input-box" />
                  )}
                />
                {errors.phone && (
                  <span className="text-red-500">{errors.phone.message}</span>
                )}
              </div>
              <div className="mb-4">
                <label className="text-gray-600" htmlFor="payment">
                  Phương thức thanh toán
                </label>
                <div className="flex items-center mt-2 space-x-4">
                  <Controller
                    name="payment" // Name should match the form field name
                    control={control}
                    render={({ field }) => (
                      <>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="momo" // Unique id for this radio button
                            {...field}
                            value="momo" // Ensure value matches the field value
                            className="mr-2"
                            checked={field.value === "momo"}
                          />
                          <label htmlFor="momo" className="text-gray-600">
                            MoMo
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="direct" // Unique id for this radio button
                            {...field}
                            value="direct" // Ensure value matches the field value
                            className="mr-2"
                            checked={field.value === "direct"}
                          />
                          <label htmlFor="direct" className="text-gray-600">
                            Thanh toán trực tiếp
                          </label>
                        </div>
                      </>
                    )}
                  />
                </div>

                {errors.payment && (
                  <span className="text-red-500">{errors.payment.message}</span>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="col-span-4 border border-gray-200 p-4 rounded">
          <h4 className="text-gray-800 text-lg mb-4 font-medium uppercase">
            Tổng thanh toán
          </h4>
          <div className="space-y-2">
            {cartState.items.length > 0 ? (
              cartState.items.map((item: CartItem) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <img
                      src={item.imgPreview || listOne}
                      alt={item.name || "Product Image"}
                      className="w-28 h-10"
                    />
                    <h5 className="text-gray-800 font-medium">
                      {item.name || "Product Name"}
                    </h5>
                  </div>
                  <p className="text-gray-600">x{item.quantity}</p>
                  <p className="text-gray-800 font-medium">
                    {(item.price * item.quantity).toLocaleString()} vnđ
                  </p>
                  <button className="ml-2 text-gray-600 hover:text-red-600 focus:outline-none">
                    <i className="fa-sharp fa-solid fa-trash"></i>
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No items in cart</p>
            )}
          </div>

          <div className="flex justify-between border-b border-gray-200 mt-1 text-gray-800 font-medium py-3 uppercase">
            <p>Thanh toán</p>
            <p>{cartState.totalPrice.toLocaleString()} vnđ</p>
          </div>
        
          <div className="flex justify-between text-gray-800 font-medium py-3 uppercase">
            <p className="font-semibold">Tổng cộng</p>
            <p>{cartState.totalPrice.toLocaleString()} vnđ</p>
          </div>

          <button
            onClick={handleSubmit(handleCheckout)}
            className="block w-full py-3 px-4 text-center text-white bg-primary border border-primary rounded-md hover:bg-transparent hover:text-primary transition font-medium"
          >
            Thanh Toán
          </button>
        </div>
      </div>
    </>
  );
};

export default Checkout;
