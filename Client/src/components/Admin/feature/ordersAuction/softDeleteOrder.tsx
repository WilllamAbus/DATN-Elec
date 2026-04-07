import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../redux/store";
import {
  restoreOrderAdminThunk,
  listSoftOrderThunk,
} from "../../../../redux/order/Admin/orderAdmin";

import "../../../../assets/css/admin.style.css";
import { Link } from "react-router-dom";
import Swal, { SweetAlertResult } from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

import withReactContent from "sweetalert2-react-content";
import { Pagination } from "@nextui-org/react";

const MySwal = withReactContent(Swal);

const ListOrdersDelete: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();

  const Order = useSelector(
    (state: RootState) => state.order.softDeletedOrders || []
  );

  const currentPage = useSelector(
    (state: RootState) => state.order.pagination?.currentPage || 1
  );
  const totalPages = useSelector(
    (state: RootState) => state.order.pagination?.totalPages || 1
  );

  const [filter, setFilter] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    dispatch(
      listSoftOrderThunk({
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
      listSoftOrderThunk({
        page: 1,
        search: searchTerm,
        stateOrder: selectedFilter === "Tất cả" ? undefined : selectedFilter,
      })
    );
  };
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const SearchTerm = event.target.value;
    setSearchTerm(SearchTerm);
    dispatch(
      listSoftOrderThunk({
        page: 1,
        search: searchTerm,
      })
    );
  };
  const handlePageChange = (page: number) => {
    dispatch(
      listSoftOrderThunk({
        page,
        search: searchTerm,
        stateOrder: filter === "Tất cả" ? undefined : filter,
      })
    );
  };
  const handlrestoreOrder = async (orderId: string) => {
    MySwal.fire({
      title: "Khôi phục đơn hàng?",
      text: "Bạn có chắc muốn khôi phục đơn hàng này không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Có",
      cancelButtonText: "Hủy",
    }).then(async (result: SweetAlertResult) => {
      if (result.isConfirmed) {
        try {
          await dispatch(restoreOrderAdminThunk({ orderId })).unwrap();
          dispatch(
            listSoftOrderThunk({
              page: currentPage,
              search: searchTerm,
            })
          );
          toast.success("Đơn hàng đã được khôi phục.");
        } catch (error) {
          console.error("Lỗi khi khôi phục đơn hàng:", error);
          toast.error("Đã xảy ra sự cố khi khôi phục đơn hàng.");
        }
      }
    });
  };

  // Tính tổng số tiền của tất cả đơn hàng
  const totalAmount = Order.reduce((sum, order) => sum + order.totalAmount, 0);

  return (
    <>
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
            <div>
              <select
                id="filter"
                value={filter}
                onChange={handleFilterChange}
                className="block w-full min-w-[8rem] rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
              >
                <option value="Tất cả">Tất cả</option>
                {/* <option value="Chờ xử lý">Chờ xử lý</option>
                <option value="Đã xác nhận">Đã xác nhận</option>
                <option value="Đang vận chuyển">Đang vận chuyển</option> */}
                <option value="Hoàn tất">Hoàn tất</option>
                <option value="Hủy đơn hàng">Hủy đơn hàng</option>
                <option value="Đã hoàn tiền">Đã hoàn tiền</option>
                <option value="Giao hàng không thành công">
                  Giao hàng không thành công{" "}
                </option>
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
                value={searchTerm}
                onChange={handleSearchChange}
                type="text"
                id="simple-search"
                placeholder="Nhập họ tên hoặc số điện thoại..."
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              />
            </div>
          </form>
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
          {Order.length > 0 ? (
            Order.map((order, index) => (
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
                  {order.shipping?.phoneNumber || "Không có số điện thoại"}
                </td>
                <td className="py-4 px-6 border-b border-grey-light">
                  {order.shipping.recipientName.length > 15
                    ? `${order.shipping.recipientName.slice(0, 15)}...`
                    : order.shipping.recipientName}
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
                        : order.stateOrder === "Đã hoàn tiền"
                        ? "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300"
                        : order.stateOrder === "Giao hàng không thành công"
                        ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
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
                          strokeLinecap="round"
                          strokeLinejoin="round"
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
                          strokeLinecap="round"
                          strokeLinejoin="round"
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
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          stroke-width="2"
                          d="M6 18 17.94 6M18 18 6.06 6"
                        />
                      </svg>
                    )}
                    {order.stateOrder === "Đã hoàn tiền" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        version="1.1"
                        width="21"
                        height="21"
                        viewBox="0 0 100 125"
                      >
                        <path d="M98.3,49.91c-1.06-1.61-2.69-2.7-4.59-3.09c-1.9-0.39-3.82-0.01-5.43,1.05L69.76,60.14c-0.86-2.28-2.84-4.04-5.33-4.55  l-30.31-6.16c-2.68-0.55-5.25-0.13-7.62,1.24l-9.42,5.43l-1.97-3.41c-0.52-0.9-1.35-1.54-2.36-1.81c-1-0.27-2.04-0.13-2.93,0.39  l-7.39,4.27c-0.89,0.51-1.53,1.35-1.8,2.35c-0.27,1-0.13,2.05,0.38,2.94L19.93,93.6c0.72,1.24,2.02,1.93,3.36,1.93  c0.65,0,1.32-0.17,1.93-0.51l7.4-4.27c1.85-1.07,2.48-3.44,1.41-5.29l-1.97-3.42l2.28-1.32c2.12-1.23,4.46-1.4,6.74-0.51l10.62,4.17  c1.34,0.52,2.7,0.78,4.04,0.78c2.11,0,4.17-0.64,6.04-1.9l34.48-23.35C99.59,57.73,100.5,53.24,98.3,49.91z M31.07,88.07l-7.39,4.27  c-0.37,0.21-0.86,0.08-1.07-0.29L3.69,59.28c-0.14-0.24-0.11-0.48-0.07-0.59c0.03-0.12,0.12-0.33,0.36-0.47c0,0,0,0,0,0l7.4-4.27  c0.14-0.08,0.27-0.1,0.38-0.1c0.08,0,0.16,0.01,0.21,0.03c0.12,0.03,0.34,0.12,0.48,0.37L31.36,87  C31.57,87.37,31.44,87.86,31.07,88.07z M94.55,57.35l-34.5,23.35c-2.19,1.48-4.75,1.77-7.22,0.8l-10.62-4.17  c-3.19-1.25-6.45-1-9.41,0.71l-2.28,1.32L18.63,58.78l9.42-5.43c1.72-1,3.5-1.29,5.45-0.89l30.32,6.16  c1.93,0.39,3.32,2.11,3.31,4.08c0,0.02,0,0.04,0,0.06c0,0.03-0.01,0.06-0.01,0.09c-0.01,0.2-0.03,0.42-0.08,0.64  c-0.22,1.08-0.85,2.01-1.77,2.62c-0.92,0.61-2.03,0.83-3.11,0.61l-20.48-4.17c-0.84-0.17-1.65,0.37-1.82,1.21s0.37,1.65,1.21,1.82  l20.48,4.17c0.48,0.1,0.97,0.15,1.45,0.15c1.4,0,2.78-0.41,3.98-1.21c1.61-1.07,2.71-2.7,3.09-4.58c0.04-0.18,0.06-0.35,0.09-0.53  L90,50.46c0.92-0.61,2.02-0.82,3.1-0.6c1.09,0.22,2.02,0.85,2.62,1.76C96.98,53.52,96.46,56.09,94.55,57.35z M75.94,27.57  c0-8.28-6.73-15.01-15.01-15.01c-8.28,0-15.01,6.73-15.01,15.01c0,8.27,6.73,15.01,15.01,15.01C69.21,42.57,75.94,35.84,75.94,27.57  z M49.01,27.57c0-6.57,5.35-11.92,11.92-11.92c6.57,0,11.92,5.35,11.92,11.92c0,6.57-5.35,11.92-11.92,11.92  C54.36,39.48,49.01,34.14,49.01,27.57z M60.91,38.09c-0.85,0-1.55-0.69-1.55-1.55v-1.34c-1.99-0.5-3.51-1.93-3.85-3.76  c-0.15-0.84,0.4-1.65,1.24-1.8c0.84-0.15,1.65,0.4,1.8,1.24c0.13,0.68,1.06,1.42,2.35,1.42c1.39,0,2.36-0.84,2.36-1.6  c0-0.85-1.1-1.6-2.36-1.6c-0.01,0-0.02,0-0.03,0c-2.98-0.03-5.39-2.12-5.39-4.69c0-2.12,1.65-3.92,3.91-4.49v-1.33  c0-0.85,0.69-1.55,1.55-1.55s1.55,0.69,1.55,1.55v1.33c1.99,0.5,3.51,1.93,3.84,3.77c0.15,0.84-0.41,1.64-1.25,1.8  c-0.84,0.15-1.64-0.41-1.8-1.25c-0.12-0.68-1.06-1.42-2.35-1.42c-1.4,0-2.37,0.84-2.37,1.6c0,0.85,1.11,1.6,2.37,1.6  c0.01,0,0.02,0,0.03,0c2.98,0.03,5.39,2.12,5.39,4.69c0,2.12-1.65,3.92-3.91,4.49v1.34C62.46,37.4,61.77,38.09,60.91,38.09z   M35.33,25.03c-0.54-0.66-0.43-1.64,0.23-2.17c0.66-0.54,1.64-0.43,2.17,0.23l0.44,0.54C40.05,12.71,49.61,4.47,60.93,4.47  c12.74,0,23.1,10.36,23.1,23.1c0,12.74-10.36,23.1-23.1,23.1c-0.85,0-1.55-0.69-1.55-1.55s0.69-1.55,1.55-1.55  c11.03,0,20.01-8.97,20.01-20.01c0-11.03-8.97-20.01-20.01-20.01c-9.89,0-18.23,7.26-19.75,16.84l1.04-0.85  c0.66-0.54,1.64-0.43,2.17,0.23c0.54,0.66,0.43,1.64-0.23,2.17l-3.68,2.98c-0.28,0.22-0.62,0.34-0.97,0.34c-0.05,0-0.11,0-0.16-0.01  c-0.41-0.04-0.78-0.25-1.04-0.57L35.33,25.03z" />
                      </svg>
                    )}
                    {order.stateOrder === "Giao hàng không thành công" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 72 90"
                        width="24"
                        height="24"
                      >
                        <g data-name="Layer 25">
                          <path d="M47.56348,13.35059A.99978.99978,0,0,0,48.5,14H59.14014a1,1,0,0,0,.40136-1.916L50.751,8.23438a2.89927,2.89927,0,0,0-3.45313.98535,2.80132,2.80132,0,0,0-.31347,2.583Zm1.38134-2.9961a.84862.84862,0,0,1,1.00391-.28808L54.36426,12h-5.1709l-.33691-.90039-.002-.00586A.78942.78942,0,0,1,48.94482,10.35449Z" />
                          <path d="M66,16H49.71973a.99974.99974,0,0,0-1,1,2.95347,2.95347,0,0,1-.187,1.05078l-1.54736,4.14258A2.81205,2.81205,0,0,0,49.62012,26a2.84244,2.84244,0,0,0,1.13086-.23437l14.72314-6.44629A2.51848,2.51848,0,0,0,67,17,.99974.99974,0,0,0,66,16ZM49.94922,23.93359a.84912.84912,0,0,1-1.0044-.28808.79335.79335,0,0,1-.08789-.7461l1.54786-4.14453A4.79842,4.79842,0,0,0,50.62158,18H63.50146Z" />
                          <path d="M56,25a.99974.99974,0,0,0-1,1V40H50a1,1,0,0,0,0,2h5v4H51a1,1,0,0,0,0,2h4V59a3.00328,3.00328,0,0,1-3,3H7.86963l2.29248-3.43555A4.98489,4.98489,0,0,0,11,55.79V35h4a1,1,0,0,0,0-2H11V28h7a1,1,0,0,0,0-2H11V21a3.00328,3.00328,0,0,1,3-3H46a1,1,0,0,0,0-2H14a5.00588,5.00588,0,0,0-5,5V55.79a2.99476,2.99476,0,0,1-.502,1.665L5.168,62.44531A.99992.99992,0,0,0,6,64H52a5.00588,5.00588,0,0,0,5-5V26A.99974.99974,0,0,0,56,25Z" />
                          <path d="M41,29.98145V29a8,8,0,0,0-16,0v.98145a7.99416,7.99416,0,0,0,.33154,2.28027l4.18262,14.06641a3.60957,3.60957,0,0,0,6.96436.02539l4.18994-14.0918A7.99416,7.99416,0,0,0,41,29.98145Zm-2,0a5.99177,5.99177,0,0,1-.24854,1.71L34.5542,45.80859a1.6099,1.6099,0,0,1-3.11572-.02539L27.24854,31.69141A5.99177,5.99177,0,0,1,27,29.98145V29a6,6,0,0,1,12,0Z" />
                          <path d="M33,51a4,4,0,1,0,4,4A4.00427,4.00427,0,0,0,33,51Zm0,6a2,2,0,1,1,2-2A2.00229,2.00229,0,0,1,33,57Z" />
                          <path d="M18,33a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Z" />
                          <path d="M21,26a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Z" />
                          <path d="M46,40H45a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Z" />
                          <path d="M45,47a.99974.99974,0,0,0,1,1h1a1,1,0,0,0,0-2H46A.99974.99974,0,0,0,45,47Z" />
                        </g>
                      </svg>
                    )}

                    {order.stateOrder}
                  </span>
                </td>
                <td className="py-4 px-6 border-b border-grey-light text-primary-600">
                  {order.totalAmount?.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }) || "0 VND"}
                </td>
                <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  <div className="flex items-center space-x-4">
                    <button
                      className={`flex items-center border font-medium rounded-lg text-sm px-3 py-2 text-center text-blue-700 bg-blue-200 hover:text-white border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-600 dark:focus:ring-blue-900`}
                      onClick={() => handlrestoreOrder(order._id!)}
                    >
                      Khôi phục
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
    </>
  );
};

export default ListOrdersDelete;
