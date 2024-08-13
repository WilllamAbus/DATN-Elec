import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../redux/store"; // Adjust the import path as needed
import { 
    restoreOrderThunk,
     fetchDeletedOrderThunk,
      removeOrderById } from "../../../../redux/checkout/checkoutThunk"; // Adjust the import path as needed
import "../../../../assets/css/admin.style.css";
import { OrderData } from "../../../../types/Checkout.d";
import Swal, { SweetAlertResult } from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";

import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);
const ListOrdersDelete: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const {deletedOrder}   = useSelector((state: RootState) => state.checkout);
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
          await dispatch(restoreOrderThunk(_id)).unwrap()
      
          dispatch(fetchDeletedOrderThunk());
          setOrder((prevOrder) =>
            prevOrder.filter((order) => order._id !== _id)
          );
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
          await dispatch(removeOrderById(_id)).unwrap()
         dispatch(  fetchDeletedOrderThunk())
          setOrder((prevOrder) =>
            prevOrder.filter((order) => order._id !== _id)
          );
        
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
    <main className="w-full flex-grow p-6">
    <div className="w-full mt-12">
      <p className="text-xl pb-3 flex items-center">
        <i className="fas fa-list mr-3"></i> DANH SÁCH ĐƠN HÀNG KHÔI PHỤC
      </p>
      <div className="bg-white overflow-auto">
        <table className="text-left w-full border-collapse">
          <thead>
            <tr>
          
           
              <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">EMAIL</th>
             
              <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">VẬN CHUYỂN</th>
              <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">PTTT</th>
              <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">TRẠNG THÁI</th>
              <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">HÀNH ĐỘNG</th>
            </tr>
          </thead>
          <tbody>
            {status === 'loading' && (
              <tr>
                <td colSpan={8} className="py-4 px-6 border-b border-grey-light text-center">Loading...</td>
              </tr>
            )}
            {status === 'failed' && (
              <tr>
                <td colSpan={8} className="py-4 px-6 border-b border-grey-light text-center text-red-500">Error: {error}</td>
              </tr>
            )}
            {deletedOrder.map((order) => (
              <tr key={order._id || 'no-id'} className="hover:bg-grey-lighter">
               
             
                <td className="py-4 px-6 border-b border-grey-light">{order.userId?.map(user => user.email).join(', ')}</td>
              
                <td className="py-4 px-6 border-b border-grey-light">
                  {order.shipping?.address || 'N/A'} {/* Replace 'address' with the correct property if needed */}
                </td>
                <td className="py-4 px-6 border-b border-grey-light">{order.payment?.method}</td>
                <td className="py-4 px-6 border-b border-grey-light">
          <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-current">
            {order?.status === "active" ? "Hiển thị" : "Đã ẩn"}
          </span>
        </td>
                <td className="py-4 px-6 border-b border-grey-light">
                <button
            className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium 
            rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
            onClick={() => order._id && handleRemoveDeleteOrder(order._id)}
          >
            Xoá
          </button>
                  <button
                  onClick={() => order._id && handleRestoreDeleteOrder(order._id)}
                    className="focus:outline-none
             text-white
              bg-green-700
               hover:bg-green-800 
               focus:ring-4
                focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2
                 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                    Khôi phục
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </main>
 
  );
};

export default ListOrdersDelete;
