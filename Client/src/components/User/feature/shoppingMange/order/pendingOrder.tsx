// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "../../../../../redux/store";
// import {
//   pendingOrdersThunk,
//   cancelOrderThunk,
// } from "../../../../../redux/order/orderThunks";
// import { Order } from "../../../../../types/order/order";
// import { Link, useNavigate } from "react-router-dom";
// import DetailOrder from "./detailOrders/detail";

// const PendingOrder: React.FC = () => {
//   const dispatch: AppDispatch = useDispatch();
//   const { orders, status, error } = useSelector(
//     (state: RootState) => state.order
//   );
//   const [showAll, setShowAll] = useState(false);
//   const [localOrders, setLocalOrders] = useState<Order[]>([]);
//   const navigate = useNavigate();
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

//   useEffect(() => {
//     dispatch(pendingOrdersThunk());
//   }, [dispatch]);

//   useEffect(() => {
//     setLocalOrders(orders);
//   }, [orders]);

//   const toggleShowAll = () => {
//     setShowAll(!showAll);
//   };

//   // Xử lý hủy đơn hàng
//   const handleCancelOrder = async (orderId: string) => {
//     const resultAction = await dispatch(cancelOrderThunk({ orderId }));
//     if (cancelOrderThunk.fulfilled.match(resultAction)) {
//       setLocalOrders((prevOrders) =>
//         prevOrders.filter((order) => order._id !== orderId)
//       );
//     }
//   };

//   const handleRepurchase = (productId: string) => {
//     navigate(`/detailProd/${productId}`);
//   };

//   const handleViewOrderDetail = (orderId: string) => {
//     const order = localOrders.find((order) => order._id === orderId);
//     setSelectedOrder(order || null);
//   };

//   const handleBackToList = () => {
//     setSelectedOrder(null);
//   };

//   return (
//     <div className="mt-7 border border-gray-300 pt-9">
//       {selectedOrder ? (
//         <DetailOrder order={selectedOrder} onBack={handleBackToList} />
//       ) : (
//         <>
//           {status === "loading" && (
//             <p className="text-center font-medium text-lg leading-8 text-gray-500 py-8">
//               Đang tải đơn hàng...
//             </p>
//           )}
//           {status === "failed" && (
//             <p className="text-center font-medium text-lg leading-8 text-red-500 py-8">
//               {error || "Có lỗi xảy ra khi tải đơn hàng."}
//             </p>
//           )}
//           {status === "succeeded" && localOrders && localOrders.length > 0 ? (
//             localOrders.map((order: Order) => (
//               <div key={order._id} className="order-item">
//                 {/* Thông tin đơn hàng */}
//                 <div className="flex flex-col md:flex-row items-center justify-between px-3 md:px-11 mb-6">
//                   <div className="order-info mb-4 md:mb-0">
//                     <p className="font-medium text-lg leading-8 text-black">
//                       Mã đơn hàng : #{order._id}
//                     </p>
//                     <p className="font-medium text-lg leading-8 text-black mt-3">
//                       Ngày đặt: {new Date(order.createdAt).toLocaleDateString()}
//                     </p>
//                   </div>
//                   <div className="flex items-center gap-3">
//                     <button
//                       onClick={() => handleCancelOrder(order._id!)}
//                       className="rounded-full px-7 py-3 bg-indigo-600 shadow-sm text-white font-semibold text-sm transition-all duration-500 hover:bg-indigo-700"
//                     >
//                       Hủy đơn hàng
//                     </button>
//                   </div>
//                 </div>

//                 {/* Thông tin sản phẩm trong đơn hàng */}
//                 <div className="border-t border-gray-300 my-6">
//                   <div className="flex flex-col lg:flex-row gap-8 px-3 md:px-11 mb-8">
//                     {order.cartDetails && order.cartDetails.length > 0 && (
//                       <div className="w-full">
//                         <div className="relative h-auto">
//                           {order.cartDetails
//                             .slice(0, showAll ? order.cartDetails.length : 2)
//                             .map((cartDetail, index) =>
//                               cartDetail.items &&
//                               cartDetail.items.length > 0 ? (
//                                 cartDetail.items.map((item) => (
//                                   <div
//                                     key={index}
//                                     className="flex flex-col items-center gap-4 sm:flex-row mb-4"
//                                   >
//                                     {item.product.image &&
//                                       item.product.image.length > 0 && (
//                                         <Link
//                                           to={`/detailProd/${item.product._id}`}
//                                         >
//                                           <img
//                                             src={item.product.image[0]}
//                                             onClick={() =>
//                                               handleRepurchase(item.product._id)
//                                             }
//                                             alt={`Hình ảnh sản phẩm ${item.product.product_name}`}
//                                             className="w-24 h-24 object-cover sm:w-32 sm:h-32 cursor-pointer"
//                                           />
//                                         </Link>
//                                       )}
//                                     <div className="flex flex-col justify-center sm:ml-4">
//                                       <h6 className="font-manrope font-semibold text-lg sm:text-xl leading-7 sm:leading-8 text-black">
//                                         {item.product.product_name}
//                                       </h6>
//                                       <div className="font-normal text-sm sm:text-lg leading-6 sm:leading-8 text-gray-500 mt-2">
//                                         Số lượng: {item.quantity}
//                                       </div>
//                                       <div className="font-normal text-sm sm:text-lg leading-6 sm:leading-8 text-gray-500 mt-2">
//                                         Giá:{" "}
//                                         {item.product.product_price_unit.toLocaleString(
//                                           "vi-VN",
//                                           {
//                                             style: "currency",
//                                             currency: "VND",
//                                           }
//                                         )}{" "}
//                                       </div>
//                                     </div>
//                                   </div>
//                                 ))
//                               ) : (
//                                 <p className="text-red-500">
//                                   Không có sản phẩm trong đơn hàng.
//                                 </p>
//                               )
//                             )}
//                           {order.cartDetails.length > 2 && (
//                             <button
//                               onClick={toggleShowAll}
//                               className="mt-4 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md transition-all duration-300 hover:bg-indigo-700"
//                             >
//                               {showAll ? "Ẩn bớt sản phẩm" : "Hiển thị tất cả"}
//                             </button>
//                           )}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 <div className="flex justify-between items-center py-9 px-3 md:px-11 border-t border-gray-300">
//                   <p className="font-semibold text-lg leading-8 text-black">
//                     Tổng tiền:{" "}
//                     <span className="text-red-600">
//                       {order.totalAmount.toLocaleString()} đ
//                     </span>
//                   </p>
//                   <button
//                     onClick={() => handleViewOrderDetail(order._id!)}
//                     className="rounded-full px-7 py-3 bg-indigo-600 shadow-sm text-white font-semibold text-sm transition-all duration-500 hover:bg-indigo-700"
//                   >
//                     Chi tiết đơn hàng
//                   </button>
//                 </div>

//                 <div className="border-t border-gray-300 my-6"></div>
//               </div>
//             ))
//           ) : (
//             <button className="rounded-full px-7 py-3 bg-indigo-600 shadow-sm text-white font-semibold text-sm transition-all duration-500 hover:bg-indigo-700">
//               Tiếp tục mua sắm
//             </button>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default PendingOrder;
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../../redux/store";
import {
  fetchUserOrdersThunk,
  cancelOrderThunk,
} from "../../../../../redux/order/orderThunks";
import { Order } from "../../../../../types/order/order";
import { Link, useNavigate } from "react-router-dom";
import DetailOrder from "./detailOrders/detail";

const PendingOrder: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { orders, status, error } = useSelector(
    (state: RootState) => state.order
  );

  const [showAll, setShowAll] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchUserOrdersThunk());
  }, [dispatch]);

  const handleCancelOrder = async (orderId: string) => {
    try {
      await dispatch(cancelOrderThunk({ orderId })).unwrap();
      dispatch(fetchUserOrdersThunk());
    } catch (err) {
      console.error("Failed to cancel the order:", err);
    }
  };

  const handleRepurchase = (productId: string) => {
    navigate(`/detailProd/${productId}`);
  };

  const handleViewOrderDetail = (orderId: string) => {
    const order = orders.find((order) => order._id === orderId);
    setSelectedOrder(order || null);
  };

  const handleBackToList = () => {
    setSelectedOrder(null);
  };

  // Lọc danh sách đơn hàng để loại bỏ các đơn hàng có trạng thái "Hủy đơn hàng"
  const filteredOrders = orders.filter(
    (order) => order.stateOrder == "Chờ xử lý"
  );

  return (
    <div className="mt-7 border border-gray-300 pt-9">
      {selectedOrder ? (
        <DetailOrder order={selectedOrder} onBack={handleBackToList} />
      ) : (
        <>
          {status === "loading" && (
            <p className="text-center font-medium text-lg leading-8 text-gray-500 py-8">
              Đang tải đơn hàng...
            </p>
          )}
          {status === "failed" && (
            <p className="text-center font-medium text-lg leading-8 text-red-500 py-8">
              {error || "Có lỗi xảy ra khi tải đơn hàng."}
            </p>
          )}
          {status === "succeeded" && filteredOrders.length > 0 ? (
            filteredOrders.map((order: Order) => (
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
                  {/* <div className="flex items-center gap-3">
                    {order.stateOrder === "Hủy đơn hàng" ? (
                      <button
                        onClick={() =>
                          handleRepurchase(
                            order.cartDetails[0]?.items[0]?.product._id
                          )
                        }
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
                  </div> */}
                  <div className="flex items-center gap-3">
                    {/* {order.stateOrder === "Hủy đơn hàng" && (
                      <button
                        onClick={() =>
                          handleRepurchase(
                            order.cartDetails[0]?.items[0]?.product._id
                          )
                        }
                        className="rounded-full px-7 py-3 bg-green-600 shadow-sm text-white font-semibold text-sm transition-all duration-500 hover:bg-green-700"
                      >
                        Mua lại
                      </button>
                    )} */}

                    {(order.stateOrder === "Chờ xử lý" ||
                      order.stateOrder === "Đã xác nhận") && (
                      <button
                        onClick={() => handleCancelOrder(order._id!)}
                        className={`rounded-full px-7 py-3 ${
                          order.stateOrder === "Chờ xử lý"
                            ? "bg-indigo-600 hover:bg-indigo-700"
                            : "bg-yellow-600 hover:bg-yellow-700"
                        } shadow-sm text-white font-semibold text-sm transition-all duration-500`}
                      >
                        Hủy đơn hàng
                      </button>
                    )}

                    {order.stateOrder === "Đang vận chuyển" && (
                      <button
                        // onClick={() => handleTrackOrder(order._id!)}
                        className="rounded-full px-7 py-3 bg-blue-600 shadow-sm text-white font-semibold text-sm transition-all duration-500 hover:bg-blue-700"
                      >
                        Đang vận chuyển
                      </button>
                    )}

                    {order.stateOrder === "Hoàn tất" && (
                      <button
                        // onClick={() => handleReviewOrder(order._id!)}
                        className="rounded-full px-7 py-3 bg-gray-600 shadow-sm text-white font-semibold text-sm transition-all duration-500 hover:bg-gray-700"
                      >
                        Giao hàng thành công
                      </button>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-300 my-6">
                  <div className="flex flex-col lg:flex-row gap-8 px-3 md:px-11 mb-8">
                    {order.cartDetails?.length > 0 && (
                      <div className="w-full">
                        <div className="relative h-auto">
                          {order.cartDetails
                            .slice(0, showAll ? order.cartDetails.length : 2)
                            .map((cartDetail) =>
                              cartDetail.items?.length > 0 ? (
                                cartDetail.items.map((item) => (
                                  <div
                                    key={item.product._id}
                                    className="flex flex-col items-center gap-4 sm:flex-row mb-4"
                                  >
                                    {item.product.image?.length > 0 && (
                                      <Link
                                        to={`/detailProd/${item.product._id}`}
                                      >
                                        <img
                                          src={item.product.image[0]} // Hiển thị hình ảnh đầu tiên từ danh sách hình ảnh
                                          onClick={() =>
                                            handleRepurchase(item.product._id)
                                          }
                                          alt={`Hình ảnh sản phẩm ${item.product.product_name}`}
                                          className="w-24 h-24 object-cover sm:w-32 sm:h-32 cursor-pointer"
                                        />
                                      </Link>
                                    )}
                                    <div className="flex flex-col justify-center sm:ml-4">
                                      <h6 className="font-manrope font-semibold text-lg sm:text-xl leading-7 sm:leading-8 text-black">
                                        {item.product.product_name}
                                      </h6>
                                      <div className="font-normal text-sm sm:text-lg leading-6 sm:leading-8 text-gray-500 mt-2">
                                        Số lượng: {item.quantity}
                                      </div>
                                      <div className="font-normal text-sm sm:text-lg leading-6 sm:leading-8 text-gray-500 mt-2">
                                        Giá:{" "}
                                        {item.product.product_price_unit.toLocaleString(
                                          "vi-VN",
                                          {
                                            style: "currency",
                                            currency: "VND",
                                          }
                                        )}{" "}
                                      </div>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <p className="text-red-500">
                                  Không có sản phẩm trong đơn hàng.
                                </p>
                              )
                            )}
                          {order.cartDetails.length > 2 && (
                            <button
                              onClick={() => setShowAll(!showAll)}
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
                      {order.totalAmount.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </span>
                  </p>
                  <button
                    onClick={() => handleViewOrderDetail(order._id!)}
                    className="rounded-full px-7 py-3 bg-indigo-600 shadow-sm text-white font-semibold text-sm transition-all duration-500 hover:bg-indigo-700"
                  >
                    Chi tiết đơn hàng
                  </button>
                </div>

                <div className="border-t border-gray-300 my-6"></div>
              </div>
            ))
          ) : (
            <button className="rounded-full px-7 py-3 bg-indigo-600 shadow-sm text-white font-semibold text-sm transition-all duration-500 hover:bg-indigo-700">
              Tiếp tục mua sắm
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default PendingOrder;
