import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../redux/store"; // Adjust the import path as needed
import {
  restoreOrderThunk,
  fetchDeletedOrderThunk,
  removeOrderById,
} from "../../../../redux/checkout/checkoutThunk"; // Adjust the import path as needed
import "../../../../assets/css/admin.style.css";
import { OrderData } from "../../../../types/Checkout.d";
import Swal, { SweetAlertResult } from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";

import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);
const ListOrdersDelete: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { deletedOrder } = useSelector((state: RootState) => state.checkout);
  const [, setOrder] = useState<OrderData[]>(deletedOrder);
  const status = useSelector((state: RootState) => state.checkout.status);
  const error = useSelector((state: RootState) => state.checkout.error);
  useEffect(() => {
    dispatch(fetchDeletedOrderThunk());
  }, [dispatch]);

  const handleRestoreDeleteOrder = async (_id: string) => {
    MySwal.fire({
      title: "Khôi phục đơn hàng?",
      text: "Bạn có muốn khôi phục đơn hàng này không!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Có",
      cancelButtonText: "Hủy",
    }).then(async (result: SweetAlertResult) => {
      if (result.isConfirmed) {
        try {
          await dispatch(restoreOrderThunk(_id)).unwrap();

          dispatch(fetchDeletedOrderThunk());
          setOrder((prevOrder) => prevOrder.filter((order) => order._id !== _id));
          MySwal.fire({
            title: "Đã xóa!",
            text: "Đơn  hàng của bạn được khôi phục.",
            icon: "success",
          });
        } catch (error) {
          console.error("Error deleting order:", error);
          MySwal.fire({
            title: "Lỗi!",
            text: "Đã xảy ra sự cố khi xóa sản phẩm.",
            icon: "error",
          });
        }
      }
    });
  };

  const handleRemoveDeleteOrder = async (_id: string) => {
    MySwal.fire({
      title: "Xóa đơn hàng?",
      text: "Bạn có chắc muốn xóa đơn hàng này không!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Có",
      cancelButtonText: "Hủy",
    }).then(async (result: SweetAlertResult) => {
      if (result.isConfirmed) {
        try {
          await dispatch(removeOrderById(_id)).unwrap();
          dispatch(fetchDeletedOrderThunk());
          setOrder((prevOrder) => prevOrder.filter((order) => order._id !== _id));

          MySwal.fire({
            title: "Đã xóa!",
            text: "Đơn  hàng của bạn đã bị xóa.",
            icon: "success",
          });
        } catch (error) {
          console.error("Error deleting order:", error);
          MySwal.fire({
            title: "Lỗi!",
            text: "Đã xảy ra sự cố khi xóa sản phẩm.",
            icon: "error",
          });
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
                id="checkbox-all"
                type="checkbox"
                className="w-4 h-4 text-primary-600 bg-gray-100 rounded border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="checkbox-all" className="sr-only">
                checkbox
              </label>
            </div>
          </th>
          <th scope="col" className="p-4">
            EMAIL
          </th>
          <th scope="col" className="p-4">
            VẬN CHUYỂN
          </th>
          <th scope="col" className="p-4">
            PTTT
          </th>
          <th scope="col" className="p-4">
            TRẠNG THÁI
          </th>
          <th scope="col" className="p-4">
            HÀNH ĐỘNG
          </th>
        </tr>
      </thead>
      <tbody>
        {status === "loading" && (
          <tr>
            <td colSpan={8} className="py-4 px-6 border-b border-grey-light text-center">
              Loading...
            </td>
          </tr>
        )}
        {status === "failed" && (
          <tr>
            <td
              colSpan={8}
              className="py-4 px-6 border-b border-grey-light text-center text-red-500"
            >
              Error: {error}
            </td>
          </tr>
        )}
        {deletedOrder.map((order) => (
          <tr
            key={order._id || "no-id"}
            className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <td className="p-4 w-4">
              <div className="flex items-center">
                <input
                  id="checkbox-table-search-1"
                  type="checkbox"
                  className="w-4 h-4 text-primary-600 bg-gray-100 rounded border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label htmlFor="checkbox-table-search-1" className="sr-only">
                  checkbox
                </label>
              </div>
            </td>
            <td className="px-4 py-3">{order.userId?.map((user) => user.email).join(", ")}</td>

            <td className="px-4 py-3">{order.shipping?.address || "N/A"} </td>
            <td className="px-4 py-3">{order.payment?.method}</td>
            <td className="px-4 py-3">
              <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-current">
                {order?.status === "active" ? "Hiển thị" : "Đã ẩn"}
              </span>
            </td>
            <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              <div className="flex items-center space-x-4">
                <button
                  className="flex items-center text-red-700 bg-red-200 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-2 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                  onClick={() => order._id && handleRemoveDeleteOrder(order._id)}
                >
                  Xoá
                </button>
                <button
                  onClick={() => order._id && handleRestoreDeleteOrder(order._id)}
                  className="flex items-center text-red-700 bg-red-200 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-2 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                >
                  Khôi phục
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ListOrdersDelete;
