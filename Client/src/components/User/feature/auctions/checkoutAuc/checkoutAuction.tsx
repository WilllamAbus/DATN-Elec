// export default CheckoutPage;
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { Button, Card, Label, Select } from "flowbite-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { RootState } from "../../../../../redux/store";

import {  ShippingAddress } from "../../../../../types/order/order";
import { Controller, useForm} from "react-hook-form";

// Define the type for form data
type FormData = {
  payment: string;
};

const CheckoutPage: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();

//   const userId = useSelector(
//     (state: RootState) => state.auth.profile.profile?._id
//   );
  const carts = useSelector((state: RootState) => state.cart.carts);
  const profile = useSelector((state: RootState) => state.auth.profile.profile);

  const { control,  } = useForm<FormData>();

  const [, setShippingAddress] =
    useState<ShippingAddress | null>(null);
  const [voucherCode, setVoucherCode] = useState<string>("");

  useEffect(() => {
    if (profile) {
      setShippingAddress({
        recipientName: profile.name,
        phoneNumber: profile.phone,
        address: profile.address,
        disabledAt: null,
        modifieon: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  }, [profile]);

  const grandTotal = carts.reduce((total, cart) => {
    return (
      total +
      cart.items.reduce((itemTotal, item) => {
        return (
          itemTotal + (item.product.product_price_unit || 0) * item.quantity
        );
      }, 0)
    );
  }, 0);

  // Update handleCheckout to use FormData type

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
            <form >
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
                  defaultValue="" // Ensure there's a default value
                  render={({ field }) => (
                    <Select id="payment" {...field}>
                      <option value="" disabled selected>
                        Chọn phương thức thanh toán
                      </option>
                      <option value="cash">Thanh toán khi nhận hàng</option>
                      {/* Thêm các phương thức thanh toán khác nếu có */}
                    </Select>
                  )}
                />
              </div>
              <br />
              <div>
                <Label htmlFor="voucher" value="Mã voucher" />
                <input
                  type="text"
                  id="voucher"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  placeholder="Nhập mã voucher nếu có"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <br />
              <Button type="submit" className="w-full bg-blue-700 text-white">
                Thanh toán
              </Button>
            </form>
          </div>
        </div>

        <div className="col-span-4">
          <Card>
            <h3 className="text-lg font-medium mb-4">Giỏ hàng</h3>
            <div className="flex flex-col">
              {carts.flatMap((cart) =>
                cart.items.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between py-2 border-b border-gray-200"
                  >
                    <span>{item.product.product_name}</span>
                    <span>
                      {item.quantity} x{" "}
                      {item.price.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </span>
                  </div>
                ))
              )}
              <div className="flex items-center justify-between py-2 font-bold">
                <span>Tổng cộng:</span>
                <span>
                  {grandTotal.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <ToastContainer />
    </>
  );
};

export default CheckoutPage;