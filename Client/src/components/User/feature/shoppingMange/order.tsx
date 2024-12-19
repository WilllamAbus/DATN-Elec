// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "../../../../redux/store";
// import {
//   cancelOrderThunk,
//   fetchUserOrdersThunk,
// } from "../../../../redux/order/orderThunks";
// import { Order } from "../../../../types/order/order";
// import { Link, useNavigate } from "react-router-dom";
// import DetailOrder from "./order/detailOrders/detail";
// import { Pagination, Select, SelectItem } from "@nextui-org/react";

// const OrderList: React.FC = () => {
//   const dispatch: AppDispatch = useDispatch();

//   const [showAll, setShowAll] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
//   const [cancelOrderId, setCancelOrderId] = useState<string | null>(null);
//   const [cancelReason, setCancelReason] = useState<string>("");
//   const [customReason, setCustomReason] = useState<string>("");

//   const Order = useSelector((state: RootState) => state.order.orders || []);

//   const currentPage = useSelector(
//     (state: RootState) => state.orderPagi.pagination?.currentPage || 1
//   );
//   const totalPages = useSelector(
//     (state: RootState) => state.orderPagi.pagination?.totalPages || 1
//   );

//   const [filter, setFilter] = useState<string>("");
//   const [searchTerm, setSearchTerm] = useState<string>("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     dispatch(
//       fetchUserOrdersThunk({
//         page: currentPage,
//         search: searchTerm,
//         stateOrder: filter === "Tất cả" ? undefined : filter,
//       })
//     );
//   }, [dispatch, currentPage, searchTerm]);
//   const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//     const selectedFilter = event.target.value;
//     setFilter(selectedFilter);

//     dispatch(
//       fetchUserOrdersThunk({
//         page: 1,
//         search: searchTerm,
//         stateOrder: selectedFilter === "Tất cả" ? undefined : selectedFilter,
//       })
//     );
//   };
//   const handlePageChange = (page: number) => {
//     dispatch(
//       fetchUserOrdersThunk({
//         page,
//         search: searchTerm,
//         stateOrder: filter === "Tất cả" ? undefined : filter,
//       })
//     );
//   };
//   const handleCancelOrder = async () => {
//     if (cancelOrderId) {
//       try {
//         await dispatch(
//           cancelOrderThunk({
//             orderId: cancelOrderId,
//             cancelReason: cancelReason || customReason,
//           })
//         ).unwrap();
//         setCancelOrderId(null);
//         setCancelReason("");
//         setCustomReason("");
//       } catch (err) {
//         console.error("Failed to cancel the order:", err);
//       }
//     }
//   };
//   console.log(cancelOrderId);

//   const openCancelOrderModal = (orderId: string) => {
//     setCancelOrderId(orderId);
//   };

//   const handleRepurchase = (productId: string) => {
//     navigate(`/detailProd/${productId}`);
//   };

//   const handleViewOrderDetail = (orderId: string) => {
//     const order = Order.find((order) => order._id === orderId);
//     setSelectedOrder(order || null);
//   };

//   const handleBackToList = () => {
//     setSelectedOrder(null);
//   };

//   const filteredOrders = Array.isArray(Order)
//     ? Order.filter((order) => order.stateOrder !== "Hủy đơn hàng")
//     : [];
//   const orderStatuses = [
//     { key: "Tất cả", label: "Tất cả" },
//     { key: "Chờ xử lý", label: "Chờ xử lý" },
//     { key: "Đã xác nhận", label: "Đã xác nhận" },
//     { key: "Đang vận chuyển", label: "Đang vận chuyển" },
//     { key: "Hoàn tất", label: "Hoàn tất" },
//     { key: "Hủy đơn hàng", label: "Hủy đơn hàng" },
//     { key: "Đã hoàn tiền", label: "Đã hoàn tiền" },
//     { key: "Giao hàng không thành công", label: "Giao hàng không thành công" },
//   ];
//   return (
//     <div className="py-5 relative">
//       <h2 className="text-3xl leading-10 text-black mb-9 flex justify-between items-center">
//         Đơn hàng
//         <div className="flex flex-row items-center w-1/3">
//           <Select
//             isRequired
//             aria-label="Order Status Filter"
//             value={filter}
//             onChange={handleFilterChange}
//             label="Chọn trạng thái đơn hàng"
//             placeholder="Chọn trạng thái"
//             color="primary"
//             className="w-full"
//           >
//             {orderStatuses.map((status) => (
//               <SelectItem key={status.key} value={status.key}>
//                 {status.label}
//               </SelectItem>
//             ))}
//           </Select>
//         </div>
//       </h2>

//       <div className="mt-7 border border-gray-300 pt-9">
//         {selectedOrder ? (
//           <DetailOrder order={selectedOrder} onBack={handleBackToList} />
//         ) : (
//           <>
//             {Order.length > 0 ? (
//               Order.map((order: Order) => (
//                 <div key={order._id} className="order-item">
//                   <div className="flex flex-col md:flex-row items-center justify-between px-3 md:px-11 mb-6">
//                     <div className="order-info mb-4 md:mb-0">
//                       <p className="font-medium text-lg leading-8 text-black">
//                         Mã đơn hàng : #{order._id}
//                       </p>
//                       <p className="font-medium text-lg leading-8 text-black mt-3">
//                         Ngày đặt:{" "}
//                         {new Date(order.createdAt).toLocaleDateString()}
//                       </p>
//                     </div>

//                     <div className="flex items-center gap-3">
//                       {(order.stateOrder === "Chờ xử lý" ||
//                         order.stateOrder === "Đã xác nhận") && (
//                         <button
//                           onClick={() => openCancelOrderModal(order._id!)}
//                           className={`rounded-full px-7 py-3 ${
//                             order.stateOrder === "Chờ xử lý"
//                               ? "bg-indigo-600 hover:bg-indigo-700"
//                               : "bg-yellow-600 hover:bg-yellow-700"
//                           } shadow-sm text-white font-semibold text-sm transition-all duration-500`}
//                         >
//                           Hủy đơn hàng
//                         </button>
//                       )}

//                       {order.stateOrder === "Đang vận chuyển" && (
//                         <button
//                           // onClick={() => handleTrackOrder(order._id!)}
//                           className="rounded-full px-7 py-3 bg-blue-600 shadow-sm text-white font-semibold text-sm transition-all duration-500 hover:bg-blue-700"
//                         >
//                           Đang vận chuyển
//                         </button>
//                       )}

//                       {order.stateOrder === "Hoàn tất" && (
//                         <button
//                           // onClick={() => handleReviewOrder(order._id!)}
//                           className="rounded-full px-7 py-3 bg-gray-600 shadow-sm text-white font-semibold text-sm transition-all duration-500 hover:bg-gray-700"
//                         >
//                           Giao hàng thành công
//                         </button>
//                       )}
//                     </div>
//                   </div>

//                   <div className="border-t border-gray-300 my-6">
//                     <div className="flex flex-col lg:flex-row gap-8 px-3 md:px-11 mb-8">
//                       {order.cartDetails?.length > 0 ? (
//                         <div className="w-full">
//                           <div className="relative h-auto">
//                             {order.cartDetails
//                               .slice(0, showAll ? order.cartDetails.length : 2)
//                               .map((cartDetail) =>
//                                 cartDetail.items?.length > 0 ? (
//                                   cartDetail.items.map((item) => (
//                                     <div
//                                       key={item.product?._id}
//                                       className="flex flex-col items-center gap-4 sm:flex-row mb-4"
//                                     >
//                                       <Link
//                                         to={`/detailProd/${item.product._id}`}
//                                       >
//                                         <img
//                                           src={
//                                             item?.productVariant?.image?.[0]
//                                               ?.image?.[0] ||
//                                             "https://img.lovepik.com/free-png/20220126/lovepik-404-page-not-accessible-png-image_401803272_wh1200.png"
//                                           }
//                                           onClick={() =>
//                                             handleRepurchase(item.product._id)
//                                           }
//                                           alt={`product ${
//                                             item.productVariant?.variant_name ||
//                                             "Unknown"
//                                           }`}
//                                           className="w-24 h-24 object-cover sm:w-32 sm:h-32 cursor-pointer"
//                                         />
//                                       </Link>

//                                       <div className="flex flex-col justify-center sm:ml-4">
//                                         <h6 className="font-manrope font-semibold text-lg sm:text-xl leading-7 sm:leading-8 text-black">
//                                           {item.productVariant?.variant_name ||
//                                             "Tên sản phẩm không có"}{" "}
//                                           {/* Hiển thị tên sản phẩm hoặc thông báo */}
//                                         </h6>
//                                         <div className="font-normal text-sm sm:text-lg leading-6 sm:leading-8 text-gray-500 mt-2">
//                                           Số lượng: {item.quantity || 0}{" "}
//                                           {/* Hiển thị số lượng hoặc 0 nếu không có */}
//                                         </div>
//                                         <div className="font-normal text-sm sm:text-lg leading-6 sm:leading-8 text-gray-500 mt-2">
//                                           Giá:{" "}
//                                           {item.productVariant &&
//                                           item.productVariant.variant_price
//                                             ? item.productVariant.variant_price.toLocaleString(
//                                                 "vi-VN",
//                                                 {
//                                                   style: "currency",
//                                                   currency: "VND",
//                                                 }
//                                               )
//                                             : "Không có giá"}
//                                           {/* Hiển thị giá hoặc thông báo */}
//                                         </div>
//                                       </div>
//                                     </div>
//                                   ))
//                                 ) : (
//                                   <p className="text-red-500">
//                                     Không có sản phẩm trong đơn hàng.
//                                   </p>
//                                 )
//                               )}
//                             {order.cartDetails.length > 2 && (
//                               <button
//                                 onClick={() => setShowAll(!showAll)}
//                                 className="mt-4 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md transition-all duration-300 hover:bg-indigo-700"
//                               >
//                                 {showAll
//                                   ? "Ẩn bớt sản phẩm"
//                                   : "Hiển thị tất cả"}
//                               </button>
//                             )}
//                           </div>
//                         </div>
//                       ) : (
//                         <p className="text-red-500">Giỏ hàng trống.</p> // Thông báo nếu giỏ hàng không có sản phẩm
//                       )}
//                     </div>
//                   </div>

//                   <div className="flex justify-between items-center py-9 px-3 md:px-11 border-t border-gray-300">
//                     <p className="font-semibold text-lg leading-8 text-black">
//                       Tổng tiền:{" "}
//                       <span className="text-red-600">
//                         {order.totalAmount.toLocaleString("vi-VN", {
//                           style: "currency",
//                           currency: "VND",
//                         })}
//                       </span>
//                     </p>
//                     <button
//                       onClick={() => handleViewOrderDetail(order._id!)}
//                       className="rounded-full px-7 py-3 bg-indigo-600 shadow-sm text-white font-semibold text-sm transition-all duration-500 hover:bg-indigo-700"
//                     >
//                       Chi tiết đơn hàng
//                     </button>
//                   </div>

//                   <div className="border-t border-gray-300 my-6"></div>
//                 </div>
//               ))
//             ) : (
//               <button className="rounded-full px-7 py-3 bg-indigo-600 shadow-sm text-white font-semibold text-sm transition-all duration-500 hover:bg-indigo-700">
//                 Tiếp tục mua sắm
//               </button>
//             )}
//           </>
//         )}
//         {cancelOrderId && (
//           <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//             <div className="bg-white p-6 rounded-lg max-w-sm mx-auto">
//               <h2 className="text-xl font-semibold mb-4">
//                 Chọn lý do hủy đơn hàng
//               </h2>
//               <label
//                 htmlFor="reasons"
//                 className="block mb-2 text-sm font-medium text-gray-900"
//               >
//                 Lý do hủy
//               </label>
//               <select
//                 id="reasons"
//                 value={cancelReason}
//                 onChange={(e) => setCancelReason(e.target.value)}
//                 className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-4"
//               >
//                 <option value="">Chọn lý do</option>
//                 <option value="Thay đổi sản phẩm khác">
//                   Thay đổi sản phẩm khác
//                 </option>
//                 <option value="Không muốn mua nữa">Không muốn mua nữa</option>
//                 <option value="Đặt nhầm đơn hàng">Đặt nhầm đơn hàng</option>
//               </select>

//               <label
//                 htmlFor="custom-reason"
//                 className="block mb-2 text-sm font-medium text-gray-900"
//               >
//                 Lý do khác (nếu có)
//               </label>
//               <input
//                 type="text"
//                 id="custom-reason"
//                 value={customReason}
//                 onChange={(e) => setCustomReason(e.target.value)}
//                 placeholder="Nhập lý do khác"
//                 className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-4"
//               />

//               {/* Hiển thị form hoàn tiền nếu thanh toán bằng Vnpay */}

//               <div className="flex justify-end gap-2">
//                 <button
//                   onClick={() => setCancelOrderId(null)}
//                   className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
//                 >
//                   Hủy bỏ
//                 </button>
//                 <button
//                   onClick={handleCancelOrder}
//                   className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
//                 >
//                   Xác nhận hủy
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//         <div className="flex justify-center my-4">
//           <Pagination
//             isCompact
//             loop
//             showControls
//             color="primary"
//             total={totalPages}
//             page={currentPage}
//             initialPage={1}
//             onChange={(page) => handlePageChange(page)}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrderList;
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../redux/store";
import {
  cancelOrderThunk,
  fetchUserOrdersThunk,
} from "../../../../redux/order/orderThunks";
import { Order } from "../../../../types/order/order";
import { Link, useNavigate } from "react-router-dom";
import DetailOrder from "./order/detailOrders/detail";
import { Pagination, Select, SelectItem } from "@nextui-org/react";

const OrderList: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();

  const [showAll, setShowAll] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [cancelOrderId, setCancelOrderId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState<string>("");
  const [customReason, setCustomReason] = useState<string>("");

  const Order = useSelector((state: RootState) => state.order.orders || []);
  console.log(Order);

  const currentPage = useSelector(
    (state: RootState) => state.orderPagi.pagination?.currentPage || 1
  );
  const totalPages = useSelector(
    (state: RootState) => state.orderPagi.pagination?.totalPages || 1
  );

  const [filter, setFilter] = useState<string>("");
  const [searchTerm] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(
      fetchUserOrdersThunk({
        page: currentPage,
        search: searchTerm,
        stateOrder: filter === "Tất cả" ? undefined : filter,
      })
    );
  }, [dispatch, currentPage, searchTerm]);
  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedFilter = event.target.value;
    setFilter(selectedFilter);

    dispatch(
      fetchUserOrdersThunk({
        page: 1,
        search: searchTerm,
        stateOrder: selectedFilter === "Tất cả" ? undefined : selectedFilter,
      })
    );
  };
  const handlePageChange = (page: number) => {
    dispatch(
      fetchUserOrdersThunk({
        page,
        search: searchTerm,
        stateOrder: filter === "Tất cả" ? undefined : filter,
      })
    );
  };
  const handleCancelOrder = async () => {
    if (cancelOrderId) {
      try {
        await dispatch(
          cancelOrderThunk({
            orderId: cancelOrderId,
            cancelReason: cancelReason || customReason,
          })
        ).unwrap();
        dispatch(
          fetchUserOrdersThunk({
            page: 1,
            search: searchTerm,
          })
        );
        setCancelOrderId(null);
        setCancelReason("");
        setCustomReason("");
      } catch (err) {
        console.error("Failed to cancel the order:", err);
      }
    }
  };
  console.log(cancelOrderId);

  const openCancelOrderModal = (orderId: string) => {
    setCancelOrderId(orderId);
  };

  const handleRepurchase = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const handleViewOrderDetail = (orderId: string) => {
    const order = Order.find((order) => order._id === orderId);
    setSelectedOrder(order || null);
  };

  const handleBackToList = () => {
    setSelectedOrder(null);
  };

  // const filteredOrders = Array.isArray(Order)
  //   ? Order.filter((order) => order.stateOrder !== "Hủy đơn hàng")
  //   : [];
  const orderStatuses = [
    { key: "Tất cả", label: "Tất cả" },
    { key: "Chờ xử lý", label: "Chờ xử lý" },
    { key: "Đã xác nhận", label: "Đã xác nhận" },
    { key: "Đang vận chuyển", label: "Đang vận chuyển" },
    { key: "Hoàn tất", label: "Hoàn tất" },
    { key: "Hủy đơn hàng", label: "Hủy đơn hàng" },
    { key: "Đã hoàn tiền", label: "Đã hoàn tiền" },
    { key: "Giao hàng không thành công", label: "Giao hàng không thành công" },
  ];
  return (
    <div className="py-5 relative">
      <h2 className="text-3xl leading-10 text-black mb-9 flex justify-between items-center">
        Đơn hàng
        <div className="flex flex-row items-center w-1/3">
          <Select
            isRequired
            aria-label="Order Status Filter"
            value={filter}
            onChange={handleFilterChange}
            label="Chọn trạng thái đơn hàng"
            placeholder="Chọn trạng thái"
            color="primary"
            className="w-full"
          >
            {orderStatuses.map((status) => (
              <SelectItem key={status.key} value={status.key}>
                {status.label}
              </SelectItem>
            ))}
          </Select>
        </div>
      </h2>

      <div className="mt-7 border border-gray-300 pt-9">
        {selectedOrder ? (
          <DetailOrder order={selectedOrder} onBack={handleBackToList} />
        ) : (
          <>
            {Order.length > 0 ? (
              Order.map((order: Order) => (
                <div key={order._id} className="order-item">
                  <div className="flex flex-col md:flex-row items-center justify-between px-3 md:px-11 mb-6">
                    <div className="order-info mb-4 md:mb-0">
                      <p className="font-medium text-lg leading-8 text-black">
                        Mã đơn hàng : #{order._id}
                      </p>
                      <p className="font-medium text-lg leading-8 text-black mt-3">
                        Ngày đặt:{" "}
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      {(order.stateOrder === "Chờ xử lý" ||
                        order.stateOrder === "Đã xác nhận") && (
                        <button
                          onClick={() => openCancelOrderModal(order._id!)}
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
                      {order.cartDetails?.length > 0 ? (
                        <div className="w-full">
                          <div className="relative h-auto">
                            {order.cartDetails
                              .slice(0, showAll ? order.cartDetails.length : 2)
                              .map((cartDetail) =>
                                cartDetail.items?.length > 0 ? (
                                  cartDetail.items.map((item) => (
                                    <div
                                      key={item.product?._id}
                                      className="flex flex-col items-center gap-4 sm:flex-row mb-6 p-6 bg-gradient-to-r from-blue-100 via-green-100 to-yellow-100 shadow-xl rounded-2xl hover:scale-105 transform transition-all duration-300"
                                    >
                                      <Link
                                        to={`/product/${item.product?.slug} || 'null'`}
                                      >
                                        <img
                                          src={
                                            item?.productVariant?.image?.[0]
                                              ?.image?.[0] ||
                                            "https://img.lovepik.com/free-png/20220126/lovepik-404-page-not-accessible-png-image_401803272_wh1200.png"
                                          }
                                          onClick={() =>
                                            handleRepurchase(item.product.slug)
                                          }
                                          alt={`product ${
                                            item.productVariant?.variant_name ||
                                            "Unknown"
                                          }`}
                                          className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                                        />
                                      </Link>

                                      <div className="flex flex-col justify-center sm:ml-4 text-center sm:text-left">
                                        <h6 className="font-manrope font-semibold text-lg sm:text-xl leading-7 sm:leading-8 text-indigo-900">
                                          {item.productVariant?.variant_name ||
                                            "Tên sản phẩm không có"}
                                        </h6>
                                        <div className="font-normal text-sm sm:text-lg leading-6 sm:leading-8 text-gray-700 mt-2">
                                          Số lượng: {item.quantity || 0}
                                        </div>
                                        <div className="font-normal text-sm sm:text-lg leading-6 sm:leading-8 text-gray-700 mt-2">
                                          Giá:{" "}
                                          {item.productVariant?.variant_price
                                            ? item.productVariant.variant_price.toLocaleString(
                                                "vi-VN",
                                                {
                                                  style: "currency",
                                                  currency: "VND",
                                                }
                                              )
                                            : "Không có giá"}
                                        </div>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-red-500 text-center">
                                    Không có sản phẩm trong đơn hàng.
                                  </p>
                                )
                              )}

                            {order.cartDetails.length > 2 && (
                              <button
                                onClick={() => setShowAll(!showAll)}
                                className="mt-4 px-8 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold rounded-md transition-all duration-300 hover:bg-indigo-800 focus:outline-none"
                              >
                                {showAll
                                  ? "Ẩn bớt sản phẩm"
                                  : "Hiển thị tất cả"}
                              </button>
                            )}
                          </div>
                        </div>
                      ) : (
                        <p className="text-red-500 text-center">
                          Giỏ hàng trống.
                        </p>
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

        {!selectedOrder && (
          <div className="flex justify-center my-4">
            <Pagination
              isCompact
              loop
              showControls
              color="primary"
              total={totalPages}
              page={currentPage}
              initialPage={1}
              onChange={(page) => handlePageChange(page)}
            />
          </div>
        )}
        {cancelOrderId && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg max-w-sm mx-auto">
              <h2 className="text-xl font-semibold mb-4">
                Chọn lý do hủy đơn hàng
              </h2>
              <label
                htmlFor="reasons"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Lý do hủy
              </label>
              <select
                id="reasons"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-4"
              >
                <option value="">Chọn lý do</option>
                <option value="Thay đổi sản phẩm khác">
                  Thay đổi sản phẩm khác
                </option>
                <option value="Không muốn mua nữa">Không muốn mua nữa</option>
                <option value="Đặt nhầm đơn hàng">Đặt nhầm đơn hàng</option>
              </select>

              <label
                htmlFor="custom-reason"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Lý do khác (nếu có)
              </label>
              <input
                type="text"
                id="custom-reason"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Nhập lý do khác"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-4"
              />

              {/* Hiển thị form hoàn tiền nếu thanh toán bằng Vnpay */}

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setCancelOrderId(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleCancelOrder}
                  className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
                >
                  Xác nhận hủy
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderList;
