import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../redux/store";
import { cancelOrderAdminThunk } from "../../../../redux/order/Admin/orderAdmin";
import { listOrderThunk } from "../../../../redux/order/orderThunks";
import "../../../../assets/css/admin.style.css";
import { Link } from "react-router-dom";
import Swal, { SweetAlertResult } from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { Order } from "../../../../types/order/order";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const ListOrders: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { orders } = useSelector((state: RootState) => state.order);
  const [orderList, setOrderList] = useState<Order[]>(orders || []);
  console.log(orderList);

  useEffect(() => {
    dispatch(listOrderThunk());
  }, [dispatch]);

  useEffect(() => {
    if (orders) {
      setOrderList(orders);
    }
  }, [orders]);

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
          dispatch(listOrderThunk());
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

  return (
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
            Mã đơn hàng
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
        {orders.length > 0 ? (
          orders.map((order) => (
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
                {order._id}
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
              <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                <div className="flex items-center space-x-4">
                  <button
                    className={`flex items-center border font-medium rounded-lg text-sm px-3 py-2 text-center ${
                      order.stateOrder === "Chờ xử lý" ||
                      order.stateOrder === "Đã xác nhận"
                        ? "text-red-700 bg-red-200 hover:text-white border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                        : "text-gray-500 bg-gray-200 border-gray-500 cursor-not-allowed dark:text-gray-400 dark:bg-gray-700 dark:border-gray-600"
                    }`}
                    onClick={() => {
                      if (
                        order.stateOrder === "Chờ xử lý" ||
                        order.stateOrder === "Đã xác nhận"
                      ) {
                        handleCancelOrder(order._id!);
                      }
                    }}
                    disabled={
                      !(
                        order.stateOrder === "Chờ xử lý" ||
                        order.stateOrder === "Đã xác nhận"
                      )
                    }
                  >
                    Hủy đơn
                  </button>
                  <Link
                    to={`/admin/listDetailOrder/${order._id}`}
                    className="py-2 px-3 flex items-center text-sm font-medium text-center text-white bg-lime-600 rounded-lg hover:bg-lime-500 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                    Xem chi tiết
                  </Link>
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
  );
};

export default ListOrders;
{
  /* <section class="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
  <div class="mx-auto max-w-screen-xl px-4 2xl:px-0">
    <div class="mx-auto max-w-5xl">
      <div class="gap-4 sm:flex sm:items-center sm:justify-between">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
          My orders
        </h2>

        <div class="mt-6 gap-4 space-y-4 sm:mt-0 sm:flex sm:items-center sm:justify-end sm:space-y-0">
          <div>
            <label
              for="order-type"
              class="sr-only mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Select order type
            </label>
            <select
              id="order-type"
              class="block w-full min-w-[8rem] rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
            >
              <option selected>All orders</option>
              <option value="pre-order">Pre-order</option>
              <option value="transit">In transit</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <span class="inline-block text-gray-500 dark:text-gray-400">
            {" "}
            from{" "}
          </span>

          <div>
            <label
              for="duration"
              class="sr-only mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Select duration
            </label>
            <select
              id="duration"
              class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
            >
              <option selected>this week</option>
              <option value="this month">this month</option>
              <option value="last 3 months">the last 3 months</option>
              <option value="lats 6 months">the last 6 months</option>
              <option value="this year">this year</option>
            </select>
          </div>
        </div>
      </div>

      <div class="mt-6 flow-root sm:mt-8">
        <div class="divide-y divide-gray-200 dark:divide-gray-700">
          <div class="flex flex-wrap items-center gap-y-4 py-6">
           
          

          <div class="flex flex-wrap items-center gap-y-4 py-6">
            <dl class="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
              <dt class="text-base font-medium text-gray-500 dark:text-gray-400">
                Order ID:
              </dt>
              <dd class="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                <a href="#" class="hover:underline">
                  #FWB125467980
                </a>
              </dd>
            </dl>

            <dl class="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
              <dt class="text-base font-medium text-gray-500 dark:text-gray-400">
                Date:
              </dt>
              <dd class="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                11.12.2023
              </dd>
            </dl>

            <dl class="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
              <dt class="text-base font-medium text-gray-500 dark:text-gray-400">
                Price:
              </dt>
              <dd class="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                $499
              </dd>
            </dl>

            <dl class="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
              <dt class="text-base font-medium text-gray-500 dark:text-gray-400">
                Status:
              </dt>
              <dd class="me-2 mt-1.5 inline-flex items-center rounded bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                <svg
                  class="me-1 h-3 w-3"
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
                    d="M13 7h6l2 4m-8-4v8m0-8V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v9h2m8 0H9m4 0h2m4 0h2v-4m0 0h-5m3.5 5.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm-10 0a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
                  />
                </svg>
                In transit
              </dd>
            </dl>

            <div class="w-full grid sm:grid-cols-2 lg:flex lg:w-64 lg:items-center lg:justify-end gap-4">
              <button
                type="button"
                class="w-full rounded-lg border border-red-700 px-3 py-2 text-center text-sm font-medium text-red-700 hover:bg-red-700 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-300 dark:border-red-500 dark:text-red-500 dark:hover:bg-red-600 dark:hover:text-white dark:focus:ring-red-900 lg:w-auto"
              >
                Cancel order
              </button>
              <a
                href="#"
                class="w-full inline-flex justify-center rounded-lg  border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 lg:w-auto"
              >
                View details
              </a>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-y-4 py-6">
            <dl class="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
              <dt class="text-base font-medium text-gray-500 dark:text-gray-400">
                Order ID:
              </dt>
              <dd class="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                <a href="#" class="hover:underline">
                  #FWB146284623
                </a>
              </dd>
            </dl>

            <dl class="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
              <dt class="text-base font-medium text-gray-500 dark:text-gray-400">
                Date:
              </dt>
              <dd class="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                26.09.2023
              </dd>
            </dl>

            <dl class="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
              <dt class="text-base font-medium text-gray-500 dark:text-gray-400">
                Price:
              </dt>
              <dd class="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                $180
              </dd>
            </dl>

            <dl class="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
              <dt class="text-base font-medium text-gray-500 dark:text-gray-400">
                Status:
              </dt>
              <dd class="me-2 mt-1.5 inline-flex items-center rounded bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-300">
                <svg
                  class="me-1 h-3 w-3"
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
                Cancelled
              </dd>
            </dl>

            <div class="w-full grid sm:grid-cols-2 lg:flex lg:w-64 lg:items-center lg:justify-end gap-4">
              <button
                type="button"
                class="w-full rounded-lg bg-primary-700 px-3 py-2 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 lg:w-auto"
              >
                Order again
              </button>
              <a
                href="#"
                class="w-full inline-flex justify-center rounded-lg  border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 lg:w-auto"
              >
                View details
              </a>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-y-4 py-6">
            <dl class="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
              <dt class="text-base font-medium text-gray-500 dark:text-gray-400">
                Order ID:
              </dt>
              <dd class="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                <a href="#" class="hover:underline">
                  #FWB159873546
                </a>
              </dd>
            </dl>

            <dl class="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
              <dt class="text-base font-medium text-gray-500 dark:text-gray-400">
                Date:
              </dt>
              <dd class="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                04.06.2023
              </dd>
            </dl>

            <dl class="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
              <dt class="text-base font-medium text-gray-500 dark:text-gray-400">
                Price:
              </dt>
              <dd class="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                $90
              </dd>
            </dl>

            <dl class="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
              <dt class="text-base font-medium text-gray-500 dark:text-gray-400">
                Status:
              </dt>
              <dd class="me-2 mt-1.5 inline-flex items-center rounded bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-300">
                <svg
                  class="me-1 h-3 w-3"
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
                Cancelled
              </dd>
            </dl>

            <div class="w-full grid sm:grid-cols-2 lg:flex lg:w-64 lg:items-center lg:justify-end gap-4">
              <button
                type="button"
                class="w-full rounded-lg bg-primary-700 px-3 py-2 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 lg:w-auto"
              >
                Order again
              </button>
              <a
                href="#"
                class="w-full inline-flex justify-center rounded-lg  border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 lg:w-auto"
              >
                View details
              </a>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-y-4 py-6">
            <dl class="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
              <dt class="text-base font-medium text-gray-500 dark:text-gray-400">
                Order ID:
              </dt>
              <dd class="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                <a href="#" class="hover:underline">
                  #FWB156475937
                </a>
              </dd>
            </dl>

            <dl class="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
              <dt class="text-base font-medium text-gray-500 dark:text-gray-400">
                Date:
              </dt>
              <dd class="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                11.02.2023
              </dd>
            </dl>

            <dl class="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
              <dt class="text-base font-medium text-gray-500 dark:text-gray-400">
                Price:
              </dt>
              <dd class="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                $1,845
              </dd>
            </dl>

            <dl class="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
              <dt class="text-base font-medium text-gray-500 dark:text-gray-400">
                Status:
              </dt>
              <dd class="me-2 mt-1.5 inline-flex items-center rounded bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                <svg
                  class="me-1 h-3 w-3"
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
                Confirmed
              </dd>
            </dl>

            <div class="w-full grid sm:grid-cols-2 lg:flex lg:w-64 lg:items-center lg:justify-end gap-4">
              <button
                type="button"
                class="w-full rounded-lg bg-primary-700 px-3 py-2 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 lg:w-auto"
              >
                Order again
              </button>
              <a
                href="#"
                class="w-full inline-flex justify-center rounded-lg  border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 lg:w-auto"
              >
                View details
              </a>
            </div>
          </div>
        </div>
      </div>

      <nav
        class="mt-6 flex items-center justify-center sm:mt-8"
        aria-label="Page navigation example"
      >
        <ul class="flex h-8 items-center -space-x-px text-sm">
          <li>
            <a
              href="#"
              class="ms-0 flex h-8 items-center justify-center rounded-s-lg border border-e-0 border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <span class="sr-only">Previous</span>
              <svg
                class="h-4 w-4 rtl:rotate-180"
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
                  d="m15 19-7-7 7-7"
                />
              </svg>
            </a>
          </li>
          <li>
            <a
              href="#"
              class="flex h-8 items-center justify-center border border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              1
            </a>
          </li>
          <li>
            <a
              href="#"
              class="flex h-8 items-center justify-center border border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              2
            </a>
          </li>
          <li>
            <a
              href="#"
              aria-current="page"
              class="z-10 flex h-8 items-center justify-center border border-primary-300 bg-primary-50 px-3 leading-tight text-primary-600 hover:bg-primary-100 hover:text-primary-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
            >
              3
            </a>
          </li>
          <li>
            <a
              href="#"
              class="flex h-8 items-center justify-center border border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              ...
            </a>
          </li>
          <li>
            <a
              href="#"
              class="flex h-8 items-center justify-center border border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              100
            </a>
          </li>
          <li>
            <a
              href="#"
              class="flex h-8 items-center justify-center rounded-e-lg border border-gray-300 bg-white px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <span class="sr-only">Next</span>
              <svg
                class="h-4 w-4 rtl:rotate-180"
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
                  d="m9 5 7 7-7 7"
                />
              </svg>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</section>; */
}
