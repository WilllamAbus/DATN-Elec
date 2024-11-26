import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../redux/store";
import { getOrderDeletedThunk, restoreOrderThunk } from "../../../../redux/orderAucAdmin/getDeletedAucAdmin/getDeletedThunk";
import { OrderDeleted } from "../../../../types/adminOrder/getDeletedOrder";
import PaginationComponent from "../../../../ultils/pagination/admin/paginationcrud";
import Swal, { SweetAlertResult } from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const ListOrdersDelete: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const {deltedOrder, totalPages} = useSelector(
    (state: RootState) => state.getDeletedOrderAucAdmin
  ) ; // Default to an empty array if undefined



  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [search, ] = useState("");


  const [, setOrder] = useState<OrderDeleted[]>(deltedOrder);
  useEffect(() => {
    dispatch(getOrderDeletedThunk({ page, pageSize, search }));
  }, [dispatch, page, pageSize, search]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // const handleSearch = (searchTerm: string) => {
  //   setSearch(searchTerm);
  //   setPage(1);
  // };
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

          dispatch(getOrderDeletedThunk({ page, pageSize, search }));
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
  return (
    <>
      {/* Uncomment this to display loading state if needed */}
      {/* {loading && <p>Loading...</p>} */}
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="p-4">
              <div className="flex items-center">
                <input
                  id="checkbox-all-orders"
                  type="checkbox"
                  className="w-4 h-4 text-primary-600 bg-gray-100 rounded border-gray-300"
                />
                <label htmlFor="checkbox-all-orders" className="sr-only">checkbox</label>
              </div>
            </th>
            <th scope="col" className="p-4">NGƯỜI DÙNG</th>
            <th scope="col" className="text-center">ĐỊA CHỈ</th>
            <th scope="col" className="p-4">SỐ ĐIỆN THOẠI</th>
            <th scope="col" className="p-4">NGẦN HÀNG THANH TOÁN</th>
            <th scope="col" className="p-4">TRẠNG THÁI</th>
            <th scope="col" className="p-4">CHỨC NĂNG</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(deltedOrder) && deltedOrder.length > 0  ? (
           deltedOrder?.map((order) => (
            <tr key={order._id} className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
              <td className="p-4 w-4">
                <div className="flex items-center">
                  <input type="checkbox" className="w-4 h-4 text-primary-600 bg-gray-100 rounded border-gray-300" />
                </div>
              </td>
              <th scope="row" className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                {order.shippingAddress.recipientName}
              </th>
              <td className="py-4 px-6 border-b border-grey-light">{order.shippingAddress.address}</td>
              <td className="py-4 px-6 border-b border-grey-light">{order.shippingAddress.phoneNumber}</td>
              <td className="py-4 px-6 border-b border-grey-light">{order.refundBank?.bankName || ''}</td>
              <td className="py-4 px-6 border-b mt-1.5 inline-flex items-center rounded text-xs font-medium border-grey-light g-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                <svg className="me-1 h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6" />
                </svg>{order.stateOrder}
              </td>
              <td className="py-4 px-6 border-b border-grey-light">
                <div className="flex items-center space-x-4">
                  <button   onClick={() => order._id && handleRestoreDeleteOrder(order._id)}
                   className="py-2 px-3 flex items-center text-sm font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-600-500 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                    Khôi phục
                  </button>
                </div>
              </td>
            </tr>
          ))
          ) : (
            <tr>
            <td colSpan={5} className="text-center py-4">
              No products found
            </td>
          </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Component */}
      <PaginationComponent
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
};

export default ListOrdersDelete;



