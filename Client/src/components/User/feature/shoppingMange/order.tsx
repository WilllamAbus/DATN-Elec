import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../redux/store";
import {
  fetchUserOrdersThunk,
  // cancelOrderThunk,
} from "../../../../redux/order/orderThunks";
import OrderList from "./order/listOrder";
import PendingOrder from "./order/pendingOrder";
import ConfirmOrders from "./order/Confirm";
import ShippingOrders from "./order/ShippingOrder";
// import { Order } from "../../../../types/order/order";
// import { useNavigate } from "react-router-dom";

const Order: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { orders, status, error } = useSelector(
    (state: RootState) => state.order
  );
  const [view, setView] = useState<
    "list" | "confirm" | "pending" | "shipping" | "completed" | "CancelOrder"
  >("list");

  // const [showAll, setShowAll] = useState(false);
  // const navigate = useNavigate();
  // // Toggle hiển thị tất cả đơn hàng
  // const toggleShowAll = () => {
  //   setShowAll(!showAll);
  // };

  // // Fetch dữ liệu đơn hàng khi component mount
  useEffect(() => {
    dispatch(fetchUserOrdersThunk());
  }, [dispatch]);

  // Log trạng thái và lỗi khi thay đổi
  useEffect(() => {
    console.log("Orders:", orders);
    console.log("Status:", status);
    console.log("Error:", error);
  }, [orders, status, error]);

  // // Xử lý hủy đơn hàng
  // const handleCancelOrder = (orderId: string) => {
  //   dispatch(cancelOrderThunk({ orderId }));
  // };
  // const handleRepurchase = (productId: string) => {
  //   navigate(`/detailProd/${productId}`);
  // };
  return (
    <div className="py-5 relative">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
        <h2 className=" text-3xl leading-10 text-black mb-9">
          Lịch sử đơn hàng
        </h2>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <ul className="flex flex-wrap sm:flex-nowrap gap-x-6 gap-y-3 sm:gap-y-0">
            <li
              onClick={() => setView("list")}
              className={` text-lg leading-8 cursor-pointer text-indigo-600 transition-all duration-500 hover:text-indigo-700 ${
                view === "list" ? "text-primary" : "text-gray-950"
              }`}
            >
              Tất cả đơn hàng
            </li>
            <li
              onClick={() => setView("pending")}
              className={` text-lg leading-8 cursor-pointer text-indigo-600 transition-all duration-500 hover:text-indigo-700 ${
                view === "pending" ? "text-primary" : "text-gray-950"
              }`}
            >
              Chờ xử lý
            </li>
            <li
              onClick={() => setView("confirm")}
              className={`text-lg leading-8 cursor-pointer text-indigo-600 transition-all duration-500 hover:text-indigo-700 ${
                view === "confirm" ? "text-primary" : "text-gray-950"
              }`}
            >
              Xác nhận
            </li>
            <li
              onClick={() => setView("shipping")}
              className={` text-lg leading-8 cursor-pointer text-indigo-600 transition-all duration-500 hover:text-indigo-700 ${
                view === "shipping" ? "text-primary" : "text-gray-950"
              }`}
            >
              Đang vận chuyển
            </li>
            <li
              onClick={() => setView("completed")}
              className={` text-lg leading-8 cursor-pointer text-indigo-600 transition-all duration-500 hover:text-indigo-700 ${
                view === "completed" ? "text-primary" : "text-gray-950"
              }`}
            >
              Hoàn tất
            </li>
            <li className=" text-lg leading-8 cursor-pointer text-black transition-all duration-500 hover:text-indigo-700">
              Đã Hủy
            </li>
          </ul>
        </div>
        {view === "list" && <OrderList />}
        {view === "pending" && <PendingOrder />}
        {view === "confirm" && <ConfirmOrders />}
        {view === "shipping" && <ShippingOrders />}
        {/* <div className="mt-7 border border-gray-300 pt-9">
          {orders && orders.length > 0 ? (
            orders.map((order: Order) => (
              <div key={order._id} className="order-item">
                <div className="flex flex-col md:flex-row items-center justify-between px-3 md:px-11 mb-6">
                  <div className="order-info mb-4 md:mb-0">
                    <p className="font-medium text-lg leading-8 text-black">
                      Mã đơn hàng : #{order._id}
                    </p>
                    <p className="font-medium text-lg leading-8 text-black mt-3">
                      Ngày đặt: {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {order.stateOrder === "Hủy đơn hàng" ? (
                      <button
                        onClick={() =>
                          handleRepurchase(order.cartDetails[0].product._id)
                        } // Assuming `productId` is available in `order`
                        className="rounded-full px-7 py-3 bg-green-600 shadow-sm text-white font-semibold text-sm transition-all duration-500 hover:bg-green-700"
                      >
                        Mua lại
                      </button>
                    ) : (
                      <button
                        onClick={() => handleCancelOrder(order._id!)}
                        className="rounded-full px-7 py-3 bg-indigo-600 shadow-sm text-white font-semibold text-sm transition-all duration-500 hover:bg-indigo-700"
                      >
                        Hủy đơn hàng
                      </button>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-300 my-6">
                  <div className="flex flex-col lg:flex-row gap-8 px-3 md:px-11 mb-8">
                    {order.cartDetails && order.cartDetails.length > 0 && (
                      <div className="w-full">
                        <div className="relative h-auto">
                          {order.cartDetails
                            .slice(0, showAll ? order.cartDetails.length : 2)
                            .map((item, index) => (
                              <div
                                key={index}
                                className="flex flex-col items-center gap-4 sm:flex-row mb-4"
                              >
                                {item.product.image &&
                                  item.product.image.length > 0 && (
                                    <img
                                      src={item.product.image[0]}
                                      alt={`Product Image ${index + 1}`}
                                      className="w-24 h-24 object-cover sm:w-32 sm:h-32"
                                    />
                                  )}
                                <div className="flex flex-col justify-center sm:ml-4">
                                  <h6 className="font-manrope font-semibold text-lg sm:text-xl leading-7 sm:leading-8 text-black">
                                    {item.product.product_name}
                                  </h6>
                                  <div className="font-normal text-sm sm:text-lg leading-6 sm:leading-8 text-gray-500 mt-2">
                                    Số lượng: {item.quantity}
                                  </div>
                                  <div className="font-normal text-sm sm:text-lg leading-6 sm:leading-8 text-gray-500 mt-2">
                                    Giá: {item.price.toLocaleString()} đ
                                  </div>
                                </div>
                              </div>
                            ))}
                          {order.cartDetails.length > 2 && (
                            <button
                              onClick={toggleShowAll}
                              className="mt-4 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md transition-all duration-300 hover:bg-indigo-700"
                            >
                              {showAll ? "Ẩn bớt sản phẩm" : "Hiển thị tất cả"}
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center py-9 px-3 md:px-11 border-t border-gray-300">
                  <p className="font-semibold text-lg leading-8 text-black">
                    Tổng tiền:{" "}
                    <span className="text-red-600">
                      {order.totalAmount.toLocaleString()} đ
                    </span>
                  </p>
                  <button className="rounded-full px-7 py-3 bg-indigo-600 shadow-sm text-white font-semibold text-sm transition-all duration-500 hover:bg-indigo-700">
                    Chi tiết đơn hàng
                  </button>
                </div>

                <div className="border-t border-gray-300 my-6"></div>
              </div>
            ))
          ) : (
            <p className="text-center font-medium text-lg leading-8 text-gray-500 py-8">
              Không có đơn hàng nào.
            </p>
          )}
        </div> */}
      </div>
    </div>
  );
};

export default Order;
