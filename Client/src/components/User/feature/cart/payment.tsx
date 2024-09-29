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

type FormData = {
  payment: string;
};

const CheckoutPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const userId = useSelector(
    (state: RootState) => state.auth.profile.profile?._id
  );
  const address = useSelector(
    (state: RootState) => state.auth.profile.profile?.address
  );
  const profile = useSelector((state: RootState) => state.auth.profile.profile);
  const carts = useSelector((state: RootState) => state.cart.carts);
  const { createPaymentUrl } = useVNPay();

  const [cart, setCart] = useState<any>(null); // Lưu trữ thông tin giỏ hàng
  const [orderId, setOrderId] = useState<string | null>(null);
  const { handleSubmit } = useForm<FormData>();
  const [selectedPayment, setSelectedPayment] = useState("");
  useEffect(() => {
    if (id) {
      dispatch(fetchCartById(id)).then((result) => {
        if (result.payload) {
          setCart(result.payload); // Lưu giỏ hàng vào state
        }
      });
    }
  }, [dispatch, id]);

  // Tính tổng tiền
  const grandTotal =
    cart?.items?.reduce((total: number, item: CartItem) => {
      return total + (item.product.product_price_unit || 0) * item.quantity;
    }, 0) || 0;

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
        amount: grandTotal,
        payment_method: paymentMethod,
        order_info: orderIdParam || "",
      },
      shipping: {
        recipientName: profile?.name || "",
        phoneNumber: profile?.phone || "",
        address: address || "",
      },
      voucher: [],
      formatShipping: "Nhanh",
      totalAmount: grandTotal,
      shippingFee: 0,
      totalPriceWithShipping: grandTotal,
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
    if (!address) {
      toast.error("Địa chỉ giao hàng không hợp lệ.");
      return;
    }
    const orderData = generateOrderData("vnPay", orderId);

    try {
      await dispatch(createOrderThunk(orderData)).unwrap();
      toast.success("Đặt hàng thành công");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Failed to create order:", error);
      toast.error("Tạo đơn hàng thất bại.");
    }
  };

  const handleCheckout: SubmitHandler<FormData> = async () => {
    if (!userId) {
      toast.error("Thông tin người dùng không hợp lệ.");
      return;
    }
    if (!address) {
      toast.error("Địa chỉ giao hàng không hợp lệ.");
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
        const paymentUrl = await createPaymentUrl(grandTotal);
        if (paymentUrl) {
          window.location.href = paymentUrl;
        }
      } else {
        await dispatch(createOrderThunk(orderData)).unwrap();
        setOrderId(orderId);
        toast.success("Đặt hàng thành công");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (error) {
      console.error("Failed to create order:", error);
      toast.error("Thanh toán thất bại.");
    }
  };

  return (
    <>
      <div>
        <form onSubmit={handleSubmit(handleCheckout)}>
          <div className="flex flex-col items-center border-b bg-white py-4 sm:flex-row sm:px-10 lg:px-20 xl:px-32">
            <a href="#" className="text-2xl font-bold text-gray-800">
              sneekpeeks
            </a>
          </div>
          <div className="grid sm:px-10 lg:grid-cols-2 lg:px-20 xl:px-32">
            <div className="px-4 pt-8">
              <p className="text-xl font-medium">Order Summary</p>
              <p className="text-gray-400">
                Check your items. And select a suitable shipping method.
              </p>
              {cart && Array.isArray(cart.items) && cart.items.length > 0 ? (
                <div>
                  {cart.items.map((item: any) => (
                    <div className="mt-8 space-y-3 rounded-lg border bg-white px-2 py-4 sm:px-6">
                      {/* Các sản phẩm trong đơn hàng */}

                      <div className="flex flex-col rounded-lg bg-white sm:flex-row">
                        <img
                          className="m-2 h-24 w-28 rounded-md border object-cover object-center"
                          src={item.product.image} // Thay đổi để sử dụng trường hình ảnh đúng
                          alt={item.product.product_name}
                        />
                        <div className="flex w-full flex-col px-4 py-4">
                          <span className="font-semibold">
                            {item.product.product_name}
                          </span>
                          <span className="float-right text-gray-400">
                            Số lượng: {item.quantity}
                          </span>
                          <p className="mt-auto text-lg font-bold">
                            {" "}
                            {item.product.product_price_unit}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Giỏ hàng trống.</p>
              )}

              <p className="mt-8 text-lg font-medium">Phương thức thanh toán</p>
              <div className="mt-5 grid gap-6">
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
                    <img
                      className="w-14 object-contain"
                      src="/images/naorrAeygcJzX0SyNI4Y0.png"
                      alt="Thanh toán khi nhận hàng"
                    />
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
                    <img
                      className="w-14 object-contain"
                      src="/images/oG8xsl3xsOkwkMsrLGKM4.png"
                      alt="VNPay"
                    />
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
              </div>
            </div>
            <div className="mt-10 bg-gray-50 px-4 pt-8 lg:mt-0">
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
                    value={profile?.name}
                  />
                  <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16 12v4m0 0H8m8 0h-8m0 0h8m-4 0v4m-4-4v4m-4-4h-2m16 0h-2M8 12H6m16 0h-2M4 6h16M4 10h16m-6-6h-2m4-4h2m-2 0H6m-4 4h2"
                      />
                    </svg>
                  </div>
                </div>
                <label
                  htmlFor="card_number"
                  className="mt-4 mb-2 block text-sm font-medium"
                >
                  Số điện thoại
                </label>
                <input
                  type="text"
                  id="card_number"
                  className="w-full rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                  value={profile?.phone}
                />
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
                  value={profile?.address}
                />

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
                      <button
                        type="button"
                        className="ml-4 rounded-md bg-blue-500 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        Check
                      </button>
                    </div>
                  </div>
                </div>
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
