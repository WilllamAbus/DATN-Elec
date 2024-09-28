// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, useParams } from "react-router-dom";
// import { AppDispatch, RootState } from "../../../../redux/store";
// import { getOrderDetailByIdThunk } from "../../../../redux/order/orderDetail";
// import { updateStatusByIdThunk } from "../../../../redux/order/Admin/orderAdmin";
// import { Button, ListGroup, Select } from "flowbite-react";
// import "react-toastify/dist/ReactToastify.css";
// import { ToastContainer, toast } from "react-toastify";

// const OrderDetails: React.FC = () => {
//   const dispatch: AppDispatch = useDispatch();
//   const { id } = useParams<{ id: string }>();
//   const orders = useSelector((state: RootState) => state.order);
//   const [selectedStatus, setSelectedStatus] = useState<string>("");
//   const navigate = useNavigate();
//   useEffect(() => {
//     if (id) {
//       dispatch(getOrderDetailByIdThunk(id));
//     }
//   }, [dispatch, id]);

//   const selectedOrder = Array.isArray(orders.orders)
//     ? orders.orders.find((order) => order._id === id)
//     : orders.orders;

//   useEffect(() => {
//     if (selectedOrder) {
//       setSelectedStatus(selectedOrder.stateOrder || "");
//     }
//   }, [selectedOrder]);

//   const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setSelectedStatus(e.target.value);
//   };
//   const handleBackToList = () => {
//     navigate("/admin/listOrders");
//   };
//   const handleUpdateStatus = () => {
//     if (selectedOrder && selectedStatus !== selectedOrder.stateOrder) {
//       dispatch(
//         updateStatusByIdThunk({
//           orderId: selectedOrder._id as string,
//           stateOrder: selectedStatus,
//         })
//       )
//         .unwrap()
//         .then((response) => {
//           const successMessage =
//             response.stateOrder || "Cập nhật trạng thái đơn hàng thành công!";
//           toast.success(successMessage);
//         })
//         .catch((error) => {
//           const errorMessage = error;

//           toast.error(errorMessage);
//         });
//     }
//   };

//   return (
//     <main className="w-full flex-grow p-6">
//       {/* <h2 className="text-2xl font-semibold mb-4">Chi tiết đơn hàng</h2> */}
//       {selectedOrder ? (
//         <div>
//           {/* Thông tin chung về đơn hàng */}
//           <div className="mb-6">
//             <p className="text-lg mb-2">
//               <span className="font-medium">Mã đơn hàng:</span> #
//               {selectedOrder._id}
//             </p>
//             <p className="text-lg mb-2">
//               <span className="font-medium">Ngày đặt:</span>{" "}
//               {new Date(selectedOrder.createdAt).toLocaleDateString()}
//             </p>
//             <p className="text-lg text-red-600 mb-2">
//               <span className="font-medium">Tổng tiền:</span>{" "}
//               {selectedOrder.totalAmount.toLocaleString()} VND
//             </p>

//             {/* Trạng thái đơn hàng với select */}
//             <div className="mb-4">
//               <label className="text-lg font-medium mb-2 block">
//                 Trạng thái:
//               </label>
//               <Select
//                 value={selectedStatus}
//                 onChange={handleStatusChange}
//                 className="block w-auto max-w-xs mt-1 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//               >
//                 <option value="Chờ xử lý">Chờ xử lý</option>
//                 <option value="Đã xác nhận">Đã xác nhận</option>
//                 <option value="Đang vận chuyển">Đang vận chuyển</option>
//                 <option value="Hoàn tất">Hoàn tất</option>
//               </Select>
//             </div>

//             <button
//               onClick={handleUpdateStatus}
//               className="mt-4 bg-blue-500 text-white p-2 rounded-md"
//             >
//               Cập nhật trạng thái
//             </button>
//           </div>

//           {/* Thông tin khách hàng */}
//           <div className="mb-6">
//             <h3 className="text-xl font-semibold mb-4">Thông tin khách hàng</h3>
//             <p className="text-lg mb-2">
//               <span className="font-medium">Họ tên:</span>{" "}
//               {selectedOrder.shipping?.recipientName || "N/A"}
//             </p>
//             <p className="text-lg mb-2">
//               <span className="font-medium">Số điện thoại:</span>{" "}
//               {selectedOrder.shipping?.phoneNumber || "N/A"}
//             </p>
//             <p className="text-lg">
//               <span className="font-medium">Địa chỉ giao hàng:</span>{" "}
//               {selectedOrder.shipping?.address || "N/A"}
//             </p>
//           </div>

//           {/* Phương thức thanh toán */}
//           <div className="mb-6">
//             <h3 className="text-xl font-semibold mb-4">
//               Phương thức thanh toán
//             </h3>
//             <p className="text-lg">
//               {selectedOrder.payment?.payment_method || "N/A"}
//             </p>
//           </div>
//         </div>
//       ) : (
//         <p>No selected order</p>
//       )}

//       {/* Danh sách sản phẩm trong đơn hàng */}
//       <div className="mb-6">
//         <h3 className="text-xl font-semibold mb-4">Sản phẩm</h3>
//         <ListGroup className="space-y-4">
//           {Array.isArray(orders.items) && orders.items.length > 0 ? (
//             orders.items.map((item: any, index: number) => (
//               <ListGroup.Item
//                 key={item.product._id || index}
//                 className="flex justify-between items-center p-4 bg-gray-100 rounded-md shadow-sm"
//               >
//                 <div className="flex items-center space-x-4">
//                   {item.product.image && item.product.image.length > 0 && (
//                     <img
//                       src={item.product.image[0]}
//                       alt={item.product.product_name}
//                       className="w-16 h-16 object-cover rounded-md"
//                     />
//                   )}
//                   <div>
//                     <h4 className="font-medium text-lg mb-1">
//                       {item.product.product_name}
//                     </h4>
//                     <p className="text-sm text-gray-600">
//                       Số lượng: {item.quantity}
//                     </p>
//                   </div>
//                 </div>
//                 <p className="text-lg">
//                   {item.product.product_price_unit.toLocaleString()} VND
//                 </p>
//               </ListGroup.Item>
//             ))
//           ) : (
//             <p className="text-lg">Không có sản phẩm nào trong đơn hàng</p>
//           )}
//         </ListGroup>
//       </div>
//       <Button className="mt-6" onClick={handleBackToList} color="gray">
//         Quay lại danh sách đơn hàng
//       </Button>

//       <ToastContainer />
//     </main>
//   );
// };

// export default OrderDetails;
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { AppDispatch, RootState } from "../../../../redux/store";
import { getOrderDetailByIdThunk } from "../../../../redux/order/orderDetail";
import { updateStatusByIdThunk } from "../../../../redux/order/Admin/orderAdmin";
import { Button, ListGroup, Select } from "flowbite-react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

const OrderDetails: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const orders = useSelector((state: RootState) => state.order);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      dispatch(getOrderDetailByIdThunk(id));
    }
  }, [dispatch, id]);

  const selectedOrder = Array.isArray(orders.orders)
    ? orders.orders.find((order) => order._id === id)
    : orders.orders;

  useEffect(() => {
    if (selectedOrder) {
      setSelectedStatus(selectedOrder.stateOrder || "");
    }
  }, [selectedOrder]);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value);
  };

  const handleBackToList = () => {
    navigate("/admin/listOrders");
  };

  const handleUpdateStatus = () => {
    if (selectedOrder && selectedStatus !== selectedOrder.stateOrder) {
      dispatch(
        updateStatusByIdThunk({
          orderId: selectedOrder._id as string,
          stateOrder: selectedStatus,
        })
      )
        .unwrap()
        .then((response) => {
          const successMessage =
            response.stateOrder || "Cập nhật trạng thái đơn hàng thành công!";
          toast.success(successMessage);
        })
        .catch((error) => {
          const errorMessage = error;
          toast.error(errorMessage);
        });
    }
  };

  return (
    <main className="w-full flex-grow p-6">
      {selectedOrder ? (
        <div>
          {/* Thông tin chung về đơn hàng */}
          <div className="mb-6">
            <p className="text-lg mb-2">
              <span className="font-medium">Mã đơn hàng:</span> #
              {selectedOrder._id}
            </p>
            <p className="text-lg mb-2">
              <span className="font-medium">Ngày đặt:</span>{" "}
              {new Date(selectedOrder.createdAt).toLocaleDateString()}
            </p>
            <p className="text-lg text-red-600 mb-2">
              <span className="font-medium">Tổng tiền:</span>{" "}
              {selectedOrder.totalAmount?.toLocaleString() || "0"} VND
            </p>

            {/* Trạng thái đơn hàng với select */}
            <div className="mb-4">
              <label className="text-lg font-medium mb-2 block">
                Trạng thái:
              </label>
              <Select
                value={selectedStatus}
                onChange={handleStatusChange}
                className="block w-auto max-w-xs mt-1 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Chờ xử lý">Chờ xử lý</option>
                <option value="Đã xác nhận">Đã xác nhận</option>
                <option value="Đang vận chuyển">Đang vận chuyển</option>
                <option value="Hoàn tất">Hoàn tất</option>
              </Select>
            </div>

            <button
              onClick={handleUpdateStatus}
              className="mt-4 bg-blue-500 text-white p-2 rounded-md"
            >
              Cập nhật trạng thái
            </button>
          </div>

          {/* Thông tin khách hàng */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4">Thông tin khách hàng</h3>
            <p className="text-lg mb-2">
              <span className="font-medium">Họ tên:</span>{" "}
              {selectedOrder.shipping?.recipientName || "N/A"}
            </p>
            <p className="text-lg mb-2">
              <span className="font-medium">Số điện thoại:</span>{" "}
              {selectedOrder.shipping?.phoneNumber || "N/A"}
            </p>
            <p className="text-lg">
              <span className="font-medium">Địa chỉ giao hàng:</span>{" "}
              {selectedOrder.shipping?.address || "N/A"}
            </p>
          </div>

          {/* Phương thức thanh toán */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4">
              Phương thức thanh toán
            </h3>
            <p className="text-lg">
              {selectedOrder.payment?.payment_method || "N/A"}
            </p>
          </div>
        </div>
      ) : (
        <p>No selected order</p>
      )}

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">Sản phẩm</h3>
        <ListGroup className="space-y-4">
          {Array.isArray(orders.items) && orders.items.length > 0 ? (
            orders.items.map((item: any, index: number) => (
              <ListGroup.Item
                key={item?.product?._id || index}
                className="flex justify-between items-center p-4 bg-gray-100 rounded-md shadow-sm"
              >
                <div className="flex items-center space-x-4">
                  {item?.product?.image && item?.product?.image.length > 0 ? (
                    <img
                      src={item?.product?.image[0] || ""}
                      alt={item?.product?.product_name || "No Image"}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                      <span>No Image</span>
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium text-lg mb-1">
                      {item?.product?.product_name || "N/A"}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Số lượng: {item?.quantity || 0}
                    </p>
                  </div>
                </div>
                <p className="text-lg">
                  {item?.product?.product_price_unit
                    ? `${item.product.product_price_unit.toLocaleString()} VND`
                    : "0 VND"}
                </p>
              </ListGroup.Item>
            ))
          ) : (
            <p className="text-lg">
              Không có sản phẩm nào trong đơn hàng hoặc đã bị xóa
            </p>
          )}
        </ListGroup>
      </div>

      <Button className="mt-6" onClick={handleBackToList} color="gray">
        Quay lại danh sách đơn hàng
      </Button>

      <ToastContainer />
    </main>
  );
};

export default OrderDetails;
