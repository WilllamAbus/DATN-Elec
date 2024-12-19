import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../redux/store";
import { getOrders } from "../../../../redux/orderAucAdmin/getAllOrder/orderAucAdminThunk";
import {
  downloadInvoiceExcel,
  getInvoicePDF,
} from "../../../../services/orderAuction/getOrderAdmin";
import "../../../../assets/css/admin.style.css";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import Swal, { SweetAlertResult } from "sweetalert2";
import PaginationComponent from "../../../../ultils/pagination/admin/paginationcrud";
import { Order } from "../../../../types/adminOrder/orderAll";
import SearchFormOrders from "./searchForm/searFormOrder";
import { softDelAdminThunk } from "../../../../redux/orderAucAdmin/softDelAucAdmin/softDelAdminThunk";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);
const ListOrderAuction: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();

  const { orders, totalPages } = useSelector(
    (state: RootState) => state.orderAucAdmin
  );

  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [search, setSearch] = useState("");

  const [, setOrders] = useState<Order[]>([]);
  useEffect(() => {
    dispatch(getOrders({ page, pageSize, search }));
  }, [dispatch, page, pageSize, search]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSearch = (searchTerm: string) => {
    setSearch(searchTerm);
    setPage(1);
  };
  const handleSoftDelOrder = async (orderId: string) => {
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
          await dispatch(softDelAdminThunk({ orderId })).unwrap();
          dispatch(getOrders({ page, pageSize, search }));
          // dispatch(fetchOrderDataShippingThunk(userId));
          setOrders((prevCategories) =>
            prevCategories.filter((order) => order._id !== orderId)
          );

          toast.success("Đơn hàng của bạn đã hủy.");
        } catch (error) {
          toast.error("Đã xảy ra sự cố khi hủy đơn hàng.");
        }
      }
    });
  };
  const handleDownloadInvoice = async (orderId: string) => {
    try {
      await downloadInvoiceExcel(orderId);
      toast.success("Tải về thành công!");
    } catch (error) {
      toast.error("Failed to download the invoice.");
      console.error("Error downloading invoice:", error);
    }
  };

  const handleDownloadInvoicePDF = async (orderId: string) => {
    try {
      await getInvoicePDF(orderId);
      toast.success("Tải về thành công!");
    } catch (error) {
      toast.error("Failed to download the invoice.");
      console.error("Error downloading invoice:", error);
    }
  };

    // const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    //   const selectedFilter = event.target.value;
    //   setFilter(selectedFilter);
  
    //   dispatch(
    //     getOrders({
    //       page: 1,
    //       search: searchTerm,
    //       stateOrder: selectedFilter === "Tất cả" ? undefined : selectedFilter,
    //     })
    //   );
    // };
  return (
    <>
      <div className="flex flex-col md:flex-row items-center justify-between mx-4 py-4 border-t dark:border-gray-700 space-y-3 md:space-y-0 md:space-x-3">
        <div className="flex-grow">
        <SearchFormOrders onSearch={handleSearch} />
        </div>
     
      </div>

      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="p-4">
              {/* <input type="checkbox" className="w-4 h-4" /> */}
            </th>
            <th scope="col" className="p-4">
              NGƯỜI DÙNG
            </th>
            <th scope="col" className="text-center">
              ĐỊA CHỈ
            </th>
            <th scope="col" className="p-4">
              SỐ ĐIỆN THOẠI
            </th>
            <th scope="col" className="p-4">
              TRẠNG THÁI
            </th>
            <th scope="col" className="p-4">
              CHỨC NĂNG
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(orders) && orders.length > 0 ? (
            orders?.map((order: Order) => (
              <tr
                key={order._id}
                className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <td className="p-4">
                  {/* <input type="checkbox" className="w-4 h-4" /> */}
                </td>
                <th scope="row" className="px-4 py-3 font-medium text-gray-900">
                  {order.shippingAddress.recipientName}
                </th>
                <td className="py-4 px-6 border-b border-grey-light">
                  {order.shippingAddress.address}
                </td>
                <td className="py-4 px-6 border-b border-grey-light">
                  {order.shippingAddress.phoneNumber}
                </td>
                <td className="py-4 px-6 border-b border-grey-light">
                  <span
                    className={`mt-1.5 inline-flex items-center rounded px-2.5 py-0.5 text-xs font-medium ${
                      order.stateOrder === "Chờ giao hàng"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                        : order.stateOrder === "Chờ xử lý"
                        ? "bg-violet-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                        : order.stateOrder === "Đã xác nhận"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                        : order.stateOrder === "Vận chuyển"
                        ? "bg-indigo-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                        : order.stateOrder === "Nhận hàng"
                        ? "bg-orange-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300"
                        : order.stateOrder === "Hoàn tất"
                        ? "bg-green-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300"
                        : order.stateOrder === "Hủy đơn hàng"
                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                     
                        : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
                    }`}
                  >
                    {order.stateOrder === "Chờ giao hàng" && (
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
                          strokeWidth={2}
                          d="M5 11.917 9.724 16.5 19 7.5"
                        />
                      </svg>
                    )}
                    {order.stateOrder === "Vận chuyển" && (
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
                    {order.stateOrder === "Nhận hàng" && (
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
    
                    {order.stateOrder}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-4">
                    <button
                      className={`flex items-center border font-medium rounded-lg text-sm px-3 py-2 text-center ${
                        order.stateOrder === "Chờ xử lý"
                          ? "text-yellow-700 bg-yellow-200 hover:text-white border-yellow-700 hover:bg-yellow-800 focus:ring-4 focus:outline-none focus:ring-yellow-300 dark:border-yellow-500 dark:text-yellow-500 dark:hover:text-white dark:hover:bg-yellow-600 dark:focus:ring-yellow-900"
                       
                          : order.stateOrder === "Hủy đơn hàng" 
                          ? "text-red-700 bg-red-200 hover:text-white border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                          : "text-gray-500 bg-gray-200 border-gray-500 cursor-not-allowed dark:text-gray-400 dark:bg-gray-700 dark:border-gray-600"
                      }`}
                      onClick={() => {
                        if (
                          order.stateOrder === "Chờ xử lý" 
                        ) {
                          handleSoftDelOrder(order._id);
                        }
                      }}
            
                      style={{ display: order.stateOrder === "Chờ xử lý" ? ' inline-flex ' : 'none' }}
                    >
                      Hủy đơn hàng
                    </button>
                    <Link to={`/admin/detailOrderAuction/${order._id}`}>
                      {/* SVG Icon embedded directly */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 12c0 5 9 9 9 9s9-4 9-9-9-9-9-9-9 4-9 9z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z"
                        />
                      </svg>
                      {/* Xem chi tiết */}
                    </Link>
                    {order.stateOrder === "Hoàn tất" && (
                      <div
                        onClick={() => handleDownloadInvoice(order._id)}
                        className="flex items-center cursor-pointer"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="32"
                          height="32"
                          viewBox="0 0 64 64"
                          className="mr-2"
                        >
                          <rect width="64" height="64" rx="8" fill="#27AE60" />
                          <path d="M20 20H44V44H20z" fill="#FFF" />
                          <path
                            d="M24 24L40 40M40 24L24 40"
                            stroke="#27AE60"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        {/* <span className="text-sm font-medium text-white">Đơn hàng Excel</span> */}
                      </div>
                    )}

                    {order.stateOrder === "Vận chuyển" && (
                      <div
                        onClick={() => handleDownloadInvoicePDF(order._id)}
                        className="flex items-center cursor-pointer"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="32"
                          height="32"
                          viewBox="0 0 64 64"
                          className="mr-2"
                        >
                          <rect width="64" height="64" rx="8" fill="#E74C3C" />
                          <path
                            d="M32 12V52M22 22H42M22 32H42M22 42H32"
                            stroke="#FFF"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        {/* <span className="text-sm font-medium text-black">Đơn hàng PDF</span> */}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-4">
                Không có đơn hàng
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <PaginationComponent
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      <ToastContainer />
    </>
  );
};

export default ListOrderAuction;
