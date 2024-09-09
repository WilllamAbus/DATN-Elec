import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../redux/store";
import { fetchUserOrdersThunk } from "../../../../redux/order/orderThunks";
import OrderList from "./order/listOrder";
import PendingOrder from "./order/pendingOrder";
import ConfirmOrders from "./order/Confirm";
import ShippingOrders from "./order/ShippingOrder";

const Order: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { orders, status, error } = useSelector(
    (state: RootState) => state.order
  );
  const [view, setView] = useState<
    "list" | "confirm" | "pending" | "shipping" | "completed" | "CancelOrder"
  >("list");

  useEffect(() => {
    dispatch(fetchUserOrdersThunk());
  }, [dispatch]);

  useEffect(() => {
    console.log("Orders:", orders);
    console.log("Status:", status);
    console.log("Error:", error);
  }, [orders, status, error]);
  return (
    <div className="py-5 relative">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
        <h2 className=" text-3xl leading-10 text-black mb-9">
          Lịch sử đơn hàng
        </h2>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <ul className="flex flex-wrap sm:flex-nowrap gap-x-5 gap-y-3 sm:gap-y-0">
            <li
              onClick={() => setView("list")}
              className={` text-lg leading-8 cursor-pointer text-indigo-600 transition-all duration-500 hover:text-indigo-700 ${
                view === "list" ? "text-primary" : "text-gray-600"
              }`}
            >
              Tất cả đơn hàng
            </li>
            <li
              onClick={() => setView("pending")}
              className={` text-lg leading-8 cursor-pointer text-indigo-600 transition-all duration-500 hover:text-indigo-700 ${
                view === "pending" ? "text-primary" : "text-gray-600"
              }`}
            >
              Chờ xử lý
            </li>
            <li
              onClick={() => setView("confirm")}
              className={`text-lg leading-8 cursor-pointer text-indigo-600 transition-all duration-500 hover:text-indigo-700 ${
                view === "confirm" ? "text-primary" : "text-gray-600"
              }`}
            >
              Xác nhận
            </li>
            <li
              onClick={() => setView("shipping")}
              className={` text-lg leading-8 cursor-pointer text-indigo-600 transition-all duration-500 hover:text-indigo-700 ${
                view === "shipping" ? "text-primary" : "text-gray-600"
              }`}
            >
              Đang vận chuyển
            </li>
            <li
              onClick={() => setView("completed")}
              className={` text-lg leading-8 cursor-pointer text-indigo-600 transition-all duration-500 hover:text-indigo-700 ${
                view === "completed" ? "text-primary" : "text-gray-600"
              }`}
            >
              Hoàn tất
            </li>
            <li
              onClick={() => setView("CancelOrder")}
              className={` text-lg leading-8 cursor-pointer text-indigo-600 transition-all duration-500 hover:text-indigo-700 ${
                view === "CancelOrder" ? "text-primary" : "text-gray-600"
              }`}
            >
              Đã Hủy
            </li>
          </ul>
        </div>
        {view === "list" && <OrderList />}
        {view === "pending" && <PendingOrder />}
        {view === "confirm" && <ConfirmOrders />}
        {view === "shipping" && <ShippingOrders />}
      </div>
    </div>
  );
};

export default Order;
