// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "../../../../redux/store";
// import {
//   cancelOrderAdminThunk,
//   deleteOrderAdminThunk,
// } from "../../../../redux/order/Admin/orderAdmin";
// import { listOrderThunk } from "../../../../redux/order/orderThunks";
// import "../../../../assets/css/admin.style.css";
// import { Link } from "react-router-dom";
// import Swal, { SweetAlertResult } from "sweetalert2";
// import "react-toastify/dist/ReactToastify.css";
// import { ToastContainer, toast } from "react-toastify";
// import { Order } from "../../../../types/order/order";
// import withReactContent from "sweetalert2-react-content";

// const MySwal = withReactContent(Swal);

// const ListOrders: React.FC = () => {
//   const dispatch: AppDispatch = useDispatch();
//   const { orders } = useSelector((state: RootState) => state.order);
//   const [orderList, setOrderList] = useState<Order[]>(orders || []);
//   const [filter, setFilter] = useState<string>("Tất cả");

//   useEffect(() => {
//     dispatch(listOrderThunk());
//   }, [dispatch]);

//   useEffect(() => {
//     if (orders) {
//       setOrderList(orders);
//     }
//   }, [orders]);

//   const handleCancelOrder = async (orderId: string) => {
//     MySwal.fire({
//       title: "Hủy đơn hàng?",
//       text: "Bạn có chắc muốn hủy đơn hàng này không?",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Có",
//       cancelButtonText: "Hủy",
//     }).then(async (result: SweetAlertResult) => {
//       if (result.isConfirmed) {
//         try {
//           await dispatch(cancelOrderAdminThunk({ orderId })).unwrap();
//           dispatch(listOrderThunk());
//           setOrderList((prevOrder) =>
//             prevOrder.filter((order) => order._id !== orderId)
//           );

//           toast.success("Đơn hàng của bạn đã bị hủy.");
//         } catch (error) {
//           toast.error("Đã xảy ra sự cố khi hủy đơn hàng.");
//         }
//       }
//     });
//   };
//   const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//     setFilter(event.target.value);
//   };
//   const handleDeleteOrder = async (orderId: string) => {
//     MySwal.fire({
//       title: "Xóa đơn hàng?",
//       text: "Bạn có chắc muốn xóa đơn hàng này không?",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Có",
//       cancelButtonText: "Hủy",
//     }).then(async (result: SweetAlertResult) => {
//       if (result.isConfirmed) {
//         try {
//           await dispatch(deleteOrderAdminThunk({ orderId })).unwrap();
//           dispatch(listOrderThunk());
//           toast.success("Đơn hàng đã được xóa.");
//         } catch (error) {
//           // Kiểm tra nội dung lỗi và hiển thị thông báo tương ứng
//           console.error("Error deleting order:", error);
//           toast.error("Đã xảy ra sự cố khi xóa đơn hàng.");
//         }
//       }
//     });
//   };

//   const filteredOrders =
//     filter === "Tất cả"
//       ? orderList
//       : orderList.filter((order) => order.stateOrder === filter);

//   if (!Array.isArray(filteredOrders)) {
//     console.error("filteredOrders is not an array:", filteredOrders);
//     return null;
//   }

//   const totalAmount = filteredOrders.reduce(
//     (sum, order) => sum + order.totalAmount,
//     0
//   );

//   return (
//     <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
//         <div className="flex-1 flex items-center space-x-2">
//           <h5>
//             <span className="text-gray-500">Tổng cộng: </span>
//             <span className="text-gray-500">
//               {totalAmount.toLocaleString("vi-VN", {
//                 style: "currency",
//                 currency: "VND",
//               })}
//             </span>
//           </h5>
//         </div>
//       </div>
//       <div className="flex flex-col md:flex-row items-stretch md:items-center md:space-x-3 space-y-3 md:space-y-0 justify-between mx-4 py-4 border-t dark:border-gray-700">
//         <div className="w-full md:w-1/2">
//           <form className="flex items-center">
//             <label htmlFor="simple-search" className="sr-only">
//               Search
//             </label>
//             <div>
//               <label
//                 htmlFor="order-type"
//                 className="sr-only mb-2 block text-sm font-medium text-gray-900 dark:text-white"
//               >
//                 Select order type
//               </label>
//               <select
//                 id="filter"
//                 value={filter}
//                 onChange={handleFilterChange}
//                 className="block w-full min-w-[8rem] rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
//               >
//                 <option value="Tất cả">Tất cả</option>
//                 <option value="Chờ xử lý">Chờ xử lý</option>
//                 <option value="Đã xác nhận">Đã xác nhận</option>
//                 <option value="Đang vận chuyển">Đang vận chuyển</option>
//                 <option value="Hoàn tất">Hoàn tất</option>
//                 <option value="Hủy đơn hàng">Hủy đơn hàng</option>
//               </select>
//             </div>
//             <div className="relative w-full">
//               <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                 <svg
//                   aria-hidden="true"
//                   className="w-5 h-5 text-gray-500 dark:text-gray-400"
//                   fill="currentColor"
//                   viewBox="0 0 20 20"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     clipRule="evenodd"
//                     d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
//                   />
//                 </svg>
//               </div>
//               <input
//                 type="text"
//                 id="simple-search"
//                 placeholder="Search for products"
//                 className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
//               />
//             </div>
//           </form>
//         </div>
//         <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
//           <Link
//             to="/admin/addProducts"
//             id="createProductButton"
//             data-modal-toggle="createProductModal"
//             className="flex items-center justify-center text-white bg-blue-500 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
//           >
//             <svg
//               className="h-3.5 w-3.5 mr-1.5 -ml-1"
//               fill="currentColor"
//               viewBox="0 0 20 20"
//               xmlns="http://www.w3.org/2000/svg"
//               aria-hidden="true"
//             >
//               <path
//                 clipRule="evenodd"
//                 fillRule="evenodd"
//                 d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
//               />
//             </svg>
//             Thêm người dùng
//           </Link>
//         </div>
//       </div>

//       <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
//         <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
//           <tr>
//             <th scope="col" className="p-4">
//               <div className="flex items-center">
//                 <input
//                   id="checkbox-all-orders"
//                   type="checkbox"
//                   className="w-4 h-4 text-primary-600 bg-gray-100 rounded border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
//                 />
//                 <label htmlFor="checkbox-all-orders" className="sr-only">
//                   checkbox
//                 </label>
//               </div>
//             </th>

//             <th scope="col" className="p-4">
//               STT
//             </th>
//             <th scope="col" className="p-4">
//               Số điện thoại
//             </th>
//             <th scope="col" className="p-4">
//               Khách hàng
//             </th>
//             <th scope="col" className="p-4">
//               Trạng thái
//             </th>
//             <th scope="col" className="p-4">
//               Tổng tiền
//             </th>
//             <th scope="col" className="p-4">
//               Chức năng
//             </th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredOrders.length > 0 ? (
//             filteredOrders.map((order, index) => (
//               <tr
//                 key={order._id}
//                 className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
//               >
//                 <td className="p-4 w-4">
//                   <div className="flex items-center">
//                     <input
//                       id={`checkbox-order-${order._id}`}
//                       type="checkbox"
//                       className="w-4 h-4 text-primary-600 bg-gray-100 rounded border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
//                     />
//                     <label
//                       htmlFor={`checkbox-order-${order._id}`}
//                       className="sr-only"
//                     >
//                       checkbox
//                     </label>
//                   </div>
//                 </td>

//                 <th
//                   scope="row"
//                   className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
//                 >
//                   {index + 1}
//                 </th>
//                 <td className="py-4 px-6 border-b border-grey-light">
//                   {order.shipping.phoneNumber}
//                 </td>
//                 <td className="py-4 px-6 border-b border-grey-light">
//                   {order.shipping.recipientName}
//                 </td>
//                 <td className="py-4 px-6 border-b border-grey-light">
//                   <span
//                     className={`mt-1.5 inline-flex items-center rounded px-2.5 py-0.5 text-xs font-medium ${
//                       order.stateOrder === "Chờ xử lý"
//                         ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
//                         : order.stateOrder === "Đã xác nhận"
//                         ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
//                         : order.stateOrder === "Đang vận chuyển"
//                         ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300"
//                         : order.stateOrder === "Hoàn tất"
//                         ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
//                         : order.stateOrder === "Trả hàng"
//                         ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
//                         : order.stateOrder === "Hủy đơn hàng"
//                         ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
//                         : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
//                     }`}
//                   >
//                     {order.stateOrder === "Đang vận chuyển" && (
//                       <svg
//                         className="me-1 h-3 w-3"
//                         aria-hidden="true"
//                         xmlns="http://www.w3.org/2000/svg"
//                         width="24"
//                         height="24"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           stroke="currentColor"
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth="2"
//                           d="M13 7h6l2 4m-8-4v8m0-8V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v9h2m8 0H9m4 0h2m4 0h2v-4m0 0h-5m3.5 5.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm-10 0a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
//                         />
//                       </svg>
//                     )}
//                     {order.stateOrder === "Chờ xử lý" && (
//                       <svg
//                         className="me-1 h-3 w-3"
//                         aria-hidden="true"
//                         xmlns="http://www.w3.org/2000/svg"
//                         width="24"
//                         height="24"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           stroke="currentColor"
//                           stroke-linecap="round"
//                           stroke-linejoin="round"
//                           stroke-width="2"
//                           d="M18.5 4h-13m13 16h-13M8 20v-3.333a2 2 0 0 1 .4-1.2L10 12.6a1 1 0 0 0 0-1.2L8.4 8.533a2 2 0 0 1-.4-1.2V4h8v3.333a2 2 0 0 1-.4 1.2L13.957 11.4a1 1 0 0 0 0 1.2l1.643 2.867a2 2 0 0 1 .4 1.2V20H8Z"
//                         />
//                       </svg>
//                     )}
//                     {order.stateOrder === "Hoàn tất" && (
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         version="1.1"
//                         className="me-1 h-4 w-4"
//                         x="0px"
//                         y="0px"
//                         viewBox="0 0 29 37.5"
//                       >
//                         <g transform="translate(-270 -380)">
//                           <g xmlns="http://www.w3.org/2000/svg">
//                             <path d="M281.5,382l-11.5,6.64v12l11,6.351l0.5,0.289l0.5-0.289l2.618-1.512c1.152,2.66,3.799,4.521,6.882,4.521    c4.143,0,7.5-3.357,7.5-7.5c0-3.629-2.576-6.654-6-7.35v-6.511L281.5,382z M281.5,383.154l10,5.774l-4.5,2.599l-10-5.774    L281.5,383.154z M281,405.836l-10-5.773v-10.269l10,5.774V405.836z M281.5,394.702l-10-5.773l4.5-2.599l10.001,5.773    L281.5,394.702z M282,405.836v-10.268l10-5.774v5.231c-0.166-0.011-0.331-0.025-0.5-0.025c-4.143,0-7.5,3.357-7.5,7.5    c0,0.7,0.104,1.375,0.283,2.018L282,405.836z M298,402.5c0,3.59-2.91,6.5-6.5,6.5s-6.5-2.91-6.5-6.5s2.91-6.5,6.5-6.5    S298,398.91,298,402.5z" />
//                             <polygon points="287.965,402.146 287.258,402.854 290.086,405.682 295.742,400.025 295.035,399.318 290.086,404.268   " />
//                           </g>
//                         </g>
//                         <text
//                           x="0"
//                           y="45"
//                           fill="#000000"
//                           font-size="5px"
//                           font-weight="bold"
//                           font-family="'Helvetica Neue', Helvetica, Arial-Unicode, Arial, Sans-serif"
//                         ></text>
//                         <text
//                           x="0"
//                           y="50"
//                           fill="#000000"
//                           font-size="5px"
//                           font-weight="bold"
//                           font-family="'Helvetica Neue', Helvetica, Arial-Unicode, Arial, Sans-serif"
//                         ></text>
//                       </svg>
//                     )}
//                     {order.stateOrder === "Đã xác nhận" && (
//                       <svg
//                         className="me-1 h-3 w-3"
//                         aria-hidden="true"
//                         xmlns="http://www.w3.org/2000/svg"
//                         width="24"
//                         height="24"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           stroke="currentColor"
//                           stroke-linecap="round"
//                           stroke-linejoin="round"
//                           stroke-width="2"
//                           d="M5 11.917 9.724 16.5 19 7.5"
//                         />
//                       </svg>
//                     )}
//                     {order.stateOrder === "Hủy đơn hàng" && (
//                       <svg
//                         className="me-1 h-3 w-3"
//                         aria-hidden="true"
//                         xmlns="http://www.w3.org/2000/svg"
//                         width="24"
//                         height="24"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           stroke="currentColor"
//                           stroke-linecap="round"
//                           stroke-linejoin="round"
//                           stroke-width="2"
//                           d="M6 18 17.94 6M18 18 6.06 6"
//                         />
//                       </svg>
//                     )}
//                     {order.stateOrder}
//                   </span>
//                 </td>
//                 <td className="py-4 px-6 border-b border-grey-light text-primary-600">
//                   {order.totalAmount.toLocaleString("vi-VN", {
//                     style: "currency",
//                     currency: "VND",
//                   })}
//                 </td>
//                 <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
//                   <div className="flex items-center space-x-4">
//                     <button
//                       className={`flex items-center border font-medium rounded-lg text-sm px-3 py-2 text-center ${
//                         order.stateOrder === "Chờ xử lý"
//                           ? "text-yellow-700 bg-yellow-200 hover:text-white border-yellow-700 hover:bg-yellow-800 focus:ring-4 focus:outline-none focus:ring-yellow-300 dark:border-yellow-500 dark:text-yellow-500 dark:hover:text-white dark:hover:bg-yellow-600 dark:focus:ring-yellow-900"
//                           : order.stateOrder === "Đã xác nhận"
//                           ? "text-blue-700 bg-blue-200 hover:text-white border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-600 dark:focus:ring-blue-900"
//                           : order.stateOrder === "Hủy đơn hàng"
//                           ? "text-red-700 bg-red-200 hover:text-white border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
//                           : "text-gray-500 bg-gray-200 border-gray-500 cursor-not-allowed dark:text-gray-400 dark:bg-gray-700 dark:border-gray-600"
//                       }`}
//                       onClick={() => {
//                         if (
//                           order.stateOrder === "Chờ xử lý" ||
//                           order.stateOrder === "Đã xác nhận"
//                         ) {
//                           handleCancelOrder(order._id!);
//                         } else if (order.stateOrder === "Hủy đơn hàng") {
//                           handleDeleteOrder(order._id!);
//                         }
//                       }}
//                       disabled={
//                         !(
//                           order.stateOrder === "Chờ xử lý" ||
//                           order.stateOrder === "Đã xác nhận" ||
//                           order.stateOrder === "Hủy đơn hàng"
//                         )
//                       }
//                     >
//                       {order.stateOrder === "Hủy đơn hàng"
//                         ? "Xóa đơn"
//                         : "Hủy đơn"}
//                     </button>

//                     <Link
//                       to={`/admin/listDetailOrder/${order._id}`}
//                       className="py-2 px-3 flex items-center text-sm font-medium text-center text-white bg-lime-600 rounded-lg hover:bg-lime-500 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
//                     >
//                       Xem chi tiết
//                     </Link>
//                   </div>
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan={6} className="text-center py-4">
//                 Không có đơn hàng nào.
//               </td>
//             </tr>
//           )}
//         </tbody>
//         <ToastContainer />
//       </table>

//       <nav
//         className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4"
//         aria-label="Table navigation"
//       >
//         <ul className="inline-flex items-stretch -space-x-px">
//           <li>
//             <a
//               href="#"
//               className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
//             >
//               <span className="sr-only">Previous</span>
//               <svg
//                 className="w-5 h-5"
//                 aria-hidden="true"
//                 fill="currentColor"
//                 viewBox="0 0 20 20"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//             </a>
//           </li>
//           <li>
//             <a
//               href="#"
//               className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
//             >
//               1
//             </a>
//           </li>
//           <li>
//             <a
//               href="#"
//               className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
//             >
//               2
//             </a>
//           </li>
//           <li>
//             <a
//               href="#"
//               aria-current="page"
//               className="flex items-center justify-center text-sm z-10 py-2 px-3 leading-tight text-primary-600 bg-primary-50 border border-primary-300 hover:bg-primary-100 hover:text-primary-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
//             >
//               3
//             </a>
//           </li>
//           <li>
//             <a
//               href="#"
//               className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
//             >
//               ...
//             </a>
//           </li>
//           <li>
//             <a
//               href="#"
//               className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
//             >
//               100
//             </a>
//           </li>
//           <li>
//             <a
//               href="#"
//               className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
//             >
//               <span className="sr-only">Next</span>
//               <svg
//                 className="w-5 h-5"
//                 aria-hidden="true"
//                 fill="currentColor"
//                 viewBox="0 0 20 20"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//             </a>
//           </li>
//         </ul>
//       </nav>
//     </div>
//   );
// };

// export default ListOrders;
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../redux/store";
import {
  cancelOrderAdminThunk,
  deleteOrderAdminThunk,
} from "../../../../redux/order/Admin/orderAdmin";
// import { listOrderThunk } from "../../../../redux/order/orderThunks";
import "../../../../assets/css/admin.style.css";
import { Link, useNavigate } from "react-router-dom";
import Swal, { SweetAlertResult } from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { Order } from "../../../../types/order/order";
import withReactContent from "sweetalert2-react-content";
import PaginationComponent from "../../../../ultils/pagination/admin/paginationcrud";
import { fetchPaginatedOrder } from "../../../../redux/order/pagiOrder/pagination";
import handleExportPDF from "../../../../hooks/ExportInvoice";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
const MySwal = withReactContent(Swal);

const ListOrders: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const Order = useSelector((state: RootState) => state.orderPagi.orders || []);
  console.log(Order);

  const [searchTerm] = useState("");
  const currentPage = useSelector(
    (state: RootState) => state.orderPagi.pagination?.currentPage || 1
  );
  const totalPages = useSelector(
    (state: RootState) => state.orderPagi.pagination?.totalPages || 1
  );
  const [orderList, setOrderList] = useState<Order[]>(Order || []);
  const [filter, setFilter] = useState<string>("Tất cả");
  //   useEffect(() => {
  //     if (orders) {
  //       setOrderList(orders);
  //     }
  //   }, [orders]);

  useEffect(() => {
    dispatch(fetchPaginatedOrder({ page: currentPage, search: searchTerm }));
  }, [dispatch, currentPage, searchTerm]);
  useEffect(() => {
    setOrderList(Order);
  }, [Order]);
  const handleCancelOrder = async (orderId: string) => {
    MySwal.fire({
      title: "Hủy đơn hàng?",
      text: "Bạn có chắc muốn hủy đơn hàng này không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Có",
      cancelButtonText: "Hủy",
    }).then(async (result: SweetAlertResult) => {
      if (result.isConfirmed) {
        try {
          await dispatch(cancelOrderAdminThunk({ orderId })).unwrap();
          dispatch(
            fetchPaginatedOrder({ page: currentPage, search: searchTerm })
          );
          setOrderList((prevOrder) =>
            prevOrder.filter((order) => order._id !== orderId)
          );

          toast.success("Đơn hàng của bạn đã bị hủy.");
        } catch (error) {
          toast.error("Đã xảy ra sự cố khi hủy đơn hàng.");
        }
      }
    });
  };

  const handlePageChange = (page: number) => {
    dispatch(fetchPaginatedOrder({ page, search: searchTerm }));
  };
  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(event.target.value);
  };
  const handleDeleteOrder = async (orderId: string) => {
    MySwal.fire({
      title: "Xóa đơn hàng?",
      text: "Bạn có chắc muốn xóa đơn hàng này không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Có",
      cancelButtonText: "Hủy",
    }).then(async (result: SweetAlertResult) => {
      if (result.isConfirmed) {
        try {
          await dispatch(deleteOrderAdminThunk({ orderId })).unwrap();
          dispatch(
            fetchPaginatedOrder({ page: currentPage, search: searchTerm })
          );
          toast.success("Đơn hàng đã được xóa.");
        } catch (error) {
          console.error("Error deleting order:", error);
          toast.error("Đã xảy ra sự cố khi xóa đơn hàng.");
        }
      }
    });
  };

  const filteredOrders =
    filter === "Tất cả"
      ? orderList
      : orderList.filter((order) => order.stateOrder === filter);

  if (!Array.isArray(filteredOrders)) {
    console.error("filteredOrders is not an array:", filteredOrders);
    return null;
  }
  const navigate = useNavigate();
  const handleAction = (action: string, order: Order) => {
    switch (action) {
      case "cancel":
        if (
          order.stateOrder !== "Chờ xử lý" &&
          order.stateOrder !== "Đã xác nhận"
        ) {
          toast.error("Không thể hủy đơn ở trạng thái này.");
          return;
        }
        handleCancelOrder(order._id!);
        break;
      case "delete":
        if (
          order.stateOrder !== "Hủy đơn hàng" &&
          order.stateOrder !== "Hoàn tất"
        ) {
          toast.error("Chỉ có thể xóa đơn đã bị hủy hoặc hoàn tất.");
          return;
        }
        handleDeleteOrder(order._id!);
        break;
      case "viewDetails":
        navigate(`/admin/listDetailOrder/${order._id}`);
        break;
      case "export":
        handleExportPDF(order);
        break;
      default:
        break;
    }
  };

  const totalAmount = filteredOrders.reduce(
    (sum, order) => sum + order.totalAmount,
    0
  );

  return (
    <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg ">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
        <div className="flex-1 flex items-center space-x-2">
          <h5>
            <span className="text-gray-500">Tổng cộng: </span>
            <span className="text-gray-500">
              {totalAmount.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </span>
          </h5>
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-stretch md:items-center md:space-x-3 space-y-3 md:space-y-0 justify-between mx-4 py-4 border-t dark:border-gray-700">
        <div className="w-full md:w-1/2">
          <form className="flex items-center">
            <label htmlFor="simple-search" className="sr-only">
              Search
            </label>
            <div>
              <label
                htmlFor="order-type"
                className="sr-only mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                Select order type
              </label>
              <select
                id="filter"
                value={filter}
                onChange={handleFilterChange}
                className="block w-full min-w-[8rem] rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
              >
                <option value="Tất cả">Tất cả</option>
                <option value="Chờ xử lý">Chờ xử lý</option>
                <option value="Đã xác nhận">Đã xác nhận</option>
                <option value="Đang vận chuyển">Đang vận chuyển</option>
                <option value="Hoàn tất">Hoàn tất</option>
                <option value="Hủy đơn hàng">Hủy đơn hàng</option>
              </select>
            </div>
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-gray-500 dark:text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  />
                </svg>
              </div>
              <input
                type="text"
                id="simple-search"
                placeholder="Search for products"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              />
            </div>
          </form>
        </div>

        <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
          <Link
            to="/admin/addProducts"
            id="createProductButton"
            data-modal-toggle="createProductModal"
            className="flex items-center justify-center text-white bg-blue-500 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
          >
            <svg
              className="h-3.5 w-3.5 mr-1.5 -ml-1"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                clipRule="evenodd"
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              />
            </svg>
            Thêm người dùng
          </Link>
        </div>
      </div>

      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="p-4">
              <div className="flex items-center">
                <input
                  id="checkbox-all-orders"
                  type="checkbox"
                  className="w-4 h-4 text-primary-600 bg-gray-100 rounded border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label htmlFor="checkbox-all-orders" className="sr-only">
                  checkbox
                </label>
              </div>
            </th>

            <th scope="col" className="p-4">
              STT
            </th>
            <th scope="col" className="p-4">
              Số điện thoại
            </th>
            <th scope="col" className="p-4">
              Khách hàng
            </th>
            <th scope="col" className="p-4">
              Trạng thái
            </th>
            <th scope="col" className="p-4">
              Tổng tiền
            </th>
            <th scope="col" className="p-4">
              Chức năng
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order, index) => (
              <tr
                key={order._id}
                className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <td className="p-4 w-4">
                  <div className="flex items-center">
                    <input
                      id={`checkbox-order-${order._id}`}
                      type="checkbox"
                      className="w-4 h-4 text-primary-600 bg-gray-100 rounded border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor={`checkbox-order-${order._id}`}
                      className="sr-only"
                    >
                      checkbox
                    </label>
                  </div>
                </td>

                <th
                  scope="row"
                  className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {index + 1}
                </th>
                <td className="py-4 px-6 border-b border-grey-light">
                  {order.shipping.phoneNumber}
                </td>
                <td className="py-4 px-6 border-b border-grey-light">
                  {order.shipping.recipientName}
                </td>
                <td className="py-4 px-6 border-b border-grey-light">
                  <span
                    className={`mt-1.5 inline-flex items-center rounded px-2.5 py-0.5 text-xs font-medium ${
                      order.stateOrder === "Chờ xử lý"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                        : order.stateOrder === "Đã xác nhận"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                        : order.stateOrder === "Đang vận chuyển"
                        ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300"
                        : order.stateOrder === "Hoàn tất"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : order.stateOrder === "Trả hàng"
                        ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                        : order.stateOrder === "Hủy đơn hàng"
                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
                    }`}
                  >
                    {order.stateOrder === "Đang vận chuyển" && (
                      <svg
                        className="me-1 h-3 w-3"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 7h6l2 4m-8-4v8m0-8V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v9h2m8 0H9m4 0h2m4 0h2v-4m0 0h-5m3.5 5.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm-10 0a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
                        />
                      </svg>
                    )}
                    {order.stateOrder === "Chờ xử lý" && (
                      <svg
                        className="me-1 h-3 w-3"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M18.5 4h-13m13 16h-13M8 20v-3.333a2 2 0 0 1 .4-1.2L10 12.6a1 1 0 0 0 0-1.2L8.4 8.533a2 2 0 0 1-.4-1.2V4h8v3.333a2 2 0 0 1-.4 1.2L13.957 11.4a1 1 0 0 0 0 1.2l1.643 2.867a2 2 0 0 1 .4 1.2V20H8Z"
                        />
                      </svg>
                    )}
                    {order.stateOrder === "Hoàn tất" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        version="1.1"
                        className="me-1 h-4 w-4"
                        x="0px"
                        y="0px"
                        viewBox="0 0 29 37.5"
                      >
                        <g transform="translate(-270 -380)">
                          <g xmlns="http://www.w3.org/2000/svg">
                            <path d="M281.5,382l-11.5,6.64v12l11,6.351l0.5,0.289l0.5-0.289l2.618-1.512c1.152,2.66,3.799,4.521,6.882,4.521    c4.143,0,7.5-3.357,7.5-7.5c0-3.629-2.576-6.654-6-7.35v-6.511L281.5,382z M281.5,383.154l10,5.774l-4.5,2.599l-10-5.774    L281.5,383.154z M281,405.836l-10-5.773v-10.269l10,5.774V405.836z M281.5,394.702l-10-5.773l4.5-2.599l10.001,5.773    L281.5,394.702z M282,405.836v-10.268l10-5.774v5.231c-0.166-0.011-0.331-0.025-0.5-0.025c-4.143,0-7.5,3.357-7.5,7.5    c0,0.7,0.104,1.375,0.283,2.018L282,405.836z M298,402.5c0,3.59-2.91,6.5-6.5,6.5s-6.5-2.91-6.5-6.5s2.91-6.5,6.5-6.5    S298,398.91,298,402.5z" />
                            <polygon points="287.965,402.146 287.258,402.854 290.086,405.682 295.742,400.025 295.035,399.318 290.086,404.268   " />
                          </g>
                        </g>
                        <text
                          x="0"
                          y="45"
                          fill="#000000"
                          font-size="5px"
                          font-weight="bold"
                          font-family="'Helvetica Neue', Helvetica, Arial-Unicode, Arial, Sans-serif"
                        ></text>
                        <text
                          x="0"
                          y="50"
                          fill="#000000"
                          font-size="5px"
                          font-weight="bold"
                          font-family="'Helvetica Neue', Helvetica, Arial-Unicode, Arial, Sans-serif"
                        ></text>
                      </svg>
                    )}
                    {order.stateOrder === "Đã xác nhận" && (
                      <svg
                        className="me-1 h-3 w-3"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M5 11.917 9.724 16.5 19 7.5"
                        />
                      </svg>
                    )}
                    {order.stateOrder === "Hủy đơn hàng" && (
                      <svg
                        className="me-1 h-3 w-3"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M6 18 17.94 6M18 18 6.06 6"
                        />
                      </svg>
                    )}

                    {order.stateOrder}
                  </span>
                </td>
                <td className="py-4 px-6 border-b border-grey-light text-primary-600">
                  {order.totalAmount.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </td>
                {/* <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  <div className="flex items-center space-x-4">
                    <button
                      className={`flex items-center border font-medium rounded-lg text-sm px-3 py-2 text-center ${
                        order.stateOrder === "Chờ xử lý"
                          ? "text-yellow-700 bg-yellow-200 hover:text-white border-yellow-700 hover:bg-yellow-800 focus:ring-4 focus:outline-none focus:ring-yellow-300 dark:border-yellow-500 dark:text-yellow-500 dark:hover:text-white dark:hover:bg-yellow-600 dark:focus:ring-yellow-900"
                          : order.stateOrder === "Đã xác nhận"
                          ? "text-blue-700 bg-blue-200 hover:text-white border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-600 dark:focus:ring-blue-900"
                          : order.stateOrder === "Hủy đơn hàng" ||
                            order.stateOrder === "Hoàn tất"
                          ? "text-red-700 bg-red-200 hover:text-white border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                          : "text-gray-500 bg-gray-200 border-gray-500 cursor-not-allowed dark:text-gray-400 dark:bg-gray-700 dark:border-gray-600"
                      }`}
                      onClick={() => {
                        if (
                          order.stateOrder === "Chờ xử lý" ||
                          order.stateOrder === "Đã xác nhận"
                        ) {
                          handleCancelOrder(order._id!);
                        } else if (
                          order.stateOrder === "Hủy đơn hàng" ||
                          order.stateOrder === "Hoàn tất"
                        ) {
                          handleDeleteOrder(order._id!); // Xóa đơn hàng nếu trạng thái hủy hoặc hoàn tất
                        }
                      }}
                      disabled={
                        !(
                          (
                            order.stateOrder === "Chờ xử lý" ||
                            order.stateOrder === "Đã xác nhận" ||
                            order.stateOrder === "Hủy đơn hàng" ||
                            order.stateOrder === "Hoàn tất"
                          ) // Thêm điều kiện cho trạng thái hoàn tất
                        )
                      }
                    >
                      {order.stateOrder === "Hủy đơn hàng" ||
                      order.stateOrder === "Hoàn tất"
                        ? "Xóa đơn"
                        : "Hủy đơn"}
                    </button>

                    <Link
                      to={`/admin/listDetailOrder/${order._id}`}
                      className="py-2 px-3 flex items-center text-sm font-medium text-center text-white bg-lime-600 rounded-lg hover:bg-lime-500 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    >
                      Xem chi tiết
                    </Link>
                  </div>
                  <td className="py-4 px-6 border-b border-grey-light">
                    <button
                      onClick={() => handleExportPDF(order)}
                      className="text-white bg-green-500 hover:bg-green-700 font-medium rounded-lg text-sm px-4 py-2"
                    >
                      Xuất hóa đơn
                    </button>
                  </td>
                </td> */}
                <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  <div className="flex items-center space-x-4">
                    <Dropdown>
                      <DropdownTrigger>
                        <Button
                          variant="bordered"
                          className="flex items-center justify-between px-4 py-2 text-gray-800 bg-white border border-gray-300 rounded-lg shadow-md hover:bg-gray-100 hover:border-gray-400 transition duration-200"
                        >
                          <span className="flex items-center">
                            <i className="iconify mdi--dots-vertical w-5 h-5 mr-2 text-gray-600" />
                            Hành động
                          </span>
                          <i className="iconify mdi--chevron-down w-4 h-4 text-gray-600" />
                        </Button>
                      </DropdownTrigger>

                      <DropdownMenu
                        variant="faded"
                        aria-label="Menu hành động đơn hàng"
                      >
                        <DropdownItem
                          key="cancel"
                          onClick={() => handleAction("cancel", order)}
                          startContent={
                            <i className="iconify mdi--cancel w-5 h-5 text-yellow-500 mr-2" />
                          }
                          isDisabled={
                            !(
                              order.stateOrder === "Chờ xử lý" ||
                              order.stateOrder === "Đã xác nhận"
                            )
                          }
                        >
                          Hủy đơn
                        </DropdownItem>

                        <DropdownItem
                          key="delete"
                          color="danger"
                          onClick={() => handleAction("delete", order)}
                          startContent={
                            <i className="iconify mdi--delete w-5 h-5 text-red-500 mr-2" />
                          }
                          isDisabled={
                            !(
                              order.stateOrder === "Hủy đơn hàng" ||
                              order.stateOrder === "Hoàn tất"
                            )
                          }
                        >
                          Xóa đơn
                        </DropdownItem>

                        <DropdownItem
                          key="viewDetails"
                          onClick={() =>
                            navigate(`/admin/listDetailOrder/${order._id}`)
                          }
                          startContent={
                            <i className="iconify mdi--eye w-5 h-5 text-blue-500 mr-2" />
                          }
                        >
                          Xem chi tiết
                        </DropdownItem>

                        <DropdownItem
                          key="export"
                          onClick={() => handleExportPDF(order)}
                          startContent={
                            <i className="iconify mdi--file-pdf-box w-5 h-5 text-green-500 mr-2" />
                          }
                        >
                          Xuất hóa đơn
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-4">
                Không có đơn hàng nào.
              </td>
            </tr>
          )}
        </tbody>
        <ToastContainer />
      </table>

      <PaginationComponent
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default ListOrders;
