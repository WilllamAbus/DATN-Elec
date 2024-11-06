// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, useParams } from "react-router-dom";
// import { AppDispatch, RootState } from "../../../../redux/store";
// import { getOrderDetailByIdThunk } from "../../../../redux/order/orderDetail";
// import { updateStatusByIdThunk } from "../../../../redux/order/Admin/orderAdmin";
// import { Button, ListGroup } from "flowbite-react";
// import "react-toastify/dist/ReactToastify.css";
// import { ToastContainer, toast } from "react-toastify";
// import withReactContent from "sweetalert2-react-content";
// import Swal, { SweetAlertResult } from "sweetalert2";

// const MySwal = withReactContent(Swal);

// const OrderDetails: React.FC = () => {
//   const dispatch: AppDispatch = useDispatch();
//   const { id } = useParams<{ id: string }>();
//   const orders = useSelector((state: RootState) => state.order);
//   // const orders = useSelector((state: RootState) => state.orderPagi.orders[0].);
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

//   const handleBackToList = () => {
//     navigate("/admin/listOrders");
//   };

//   const handleUpdateStatus = () => {
//     if (selectedOrder && selectedStatus !== selectedOrder.stateOrder) {
//       MySwal.fire({
//         title: "Xác nhận cập nhật trạng thái?",
//         text: `Bạn có chắc chắn muốn cập nhật trạng thái đơn hàng thành "${selectedStatus}" không?`,
//         icon: "warning",
//         showCancelButton: true,
//         confirmButtonColor: "#3085d6",
//         cancelButtonColor: "#d33",
//         confirmButtonText: "Có",
//         cancelButtonText: "Hủy",
//       }).then(async (result: SweetAlertResult) => {
//         if (result.isConfirmed) {
//           dispatch(
//             updateStatusByIdThunk({
//               orderId: selectedOrder._id as string,
//               stateOrder: selectedStatus,
//             })
//           )
//             .unwrap()
//             .then((response) => {
//               const successMessage =
//                 response.stateOrder ||
//                 "Cập nhật trạng thái đơn hàng thành công!";
//               toast.success(successMessage);
//             })
//             .catch((error) => {
//               const errorMessage = error;
//               toast.error(errorMessage);
//             });
//         }
//       });
//     }
//   };

//   return (
//     <main className="w-full flex-grow p-6">
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
//               {selectedOrder.totalAmount?.toLocaleString() || "0"} VND
//             </p>

//             {/* Trạng thái đơn hàng */}
//             <div className="mb-4">
//               <label className="text-lg font-medium mb-2 block">
//                 Trạng thái:
//               </label>
//               <p>{selectedOrder.stateOrder}</p>
//             </div>

//             {/* Nút cập nhật trạng thái */}
//             {selectedOrder.stateOrder === "Chờ xử lý" ? (
//               <button
//                 onClick={() => {
//                   setSelectedStatus("Đã xác nhận");
//                   handleUpdateStatus();
//                 }}
//                 className="mt-4 bg-green-500 text-white p-2 rounded-md"
//               >
//                 Đã xác nhận
//               </button>
//             ) : selectedOrder.stateOrder === "Đã xác nhận" ? (
//               <button
//                 onClick={() => {
//                   setSelectedStatus("Đang vận chuyển");
//                   handleUpdateStatus();
//                 }}
//                 className="mt-4 bg-yellow-500 text-white p-2 rounded-md"
//               >
//                 Đang vận chuyển
//               </button>
//             ) : selectedOrder.stateOrder === "Đang vận chuyển" ? (
//               <button
//                 onClick={() => {
//                   setSelectedStatus("Hoàn tất");
//                   handleUpdateStatus();
//                 }}
//                 className="mt-4 bg-blue-500 text-white p-2 rounded-md"
//               >
//                 Hoàn tất
//               </button>
//             ) : (
//               <p className="mt-4 text-gray-500">Đơn hàng đã hoàn tất</p>
//             )}
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

//           {/* Sản phẩm */}
//           <div className="mb-6">
//             <h3 className="text-xl font-semibold mb-4">Sản phẩm</h3>
//             <ListGroup className="space-y-4">
//               {Array.isArray(orders.items) && orders.items.length > 0 ? (
//                 orders.items.map((item: any, index: number) => (
//                   <ListGroup.Item
//                     key={item?.product?._id || index}
//                     className="flex justify-between items-center p-4 bg-gray-100 rounded-md shadow-sm"
//                   >
//                     <div className="flex items-center space-x-4">
//                       {item?.product?.image &&
//                       item?.product?.image.length > 0 ? (
//                         <img
//                           src={item?.product?.image[0] || ""}
//                           alt={item?.product?.product_name || "No Image"}
//                           className="w-16 h-16 object-cover rounded-md"
//                         />
//                       ) : (
//                         <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
//                           <span>No Image</span>
//                         </div>
//                       )}
//                       <div>
//                         <h4 className="font-medium text-lg mb-1">
//                           {item?.product?.product_name || "N/A"}
//                         </h4>
//                         <p className="text-sm text-gray-600">
//                           Số lượng: {item?.quantity || 0}
//                         </p>
//                       </div>
//                     </div>
//                     <p className="text-lg">
//                       {item?.product?.product_price_unit
//                         ? `${item.product.product_price_unit.toLocaleString()} VND`
//                         : "0 VND"}
//                     </p>
//                   </ListGroup.Item>
//                 ))
//               ) : (
//                 <p className="text-lg">
//                   Không có sản phẩm nào trong đơn hàng hoặc đã bị xóa
//                 </p>
//               )}
//             </ListGroup>
//           </div>

//           <Button className="mt-6" onClick={handleBackToList} color="gray">
//             Quay lại danh sách đơn hàng
//           </Button>

//           <ToastContainer />
//         </div>
//       ) : (
//         <p>No selected order</p>
//       )}
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
import { Button, ListGroup } from "flowbite-react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import withReactContent from "sweetalert2-react-content";
import Swal, { SweetAlertResult } from "sweetalert2";
import { fetchPaginatedOrder } from "../../../../redux/order/pagiOrder/pagination";

const MySwal = withReactContent(Swal);

const OrderDetails: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const order = useSelector((state: RootState) => state.orderPagi.orders[0]);
  const product = useSelector((state: RootState) => state.order);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [searchTerm] = useState("");
  const currentPage = useSelector(
    (state: RootState) => state.orderPagi.pagination?.currentPage || 1
  );

  const navigate = useNavigate();
  useEffect(() => {
    dispatch(fetchPaginatedOrder({ page: currentPage, search: searchTerm }));
  }, [dispatch, currentPage, searchTerm]);
  useEffect(() => {
    if (id) {
      dispatch(getOrderDetailByIdThunk(id));
    }
  }, [dispatch, id]);

  const handleBackToList = () => {
    navigate("/admin/listOrders");
  };

  const handleUpdateStatus = () => {
    if (order && order._id && selectedStatus) {
      MySwal.fire({
        title: "Xác nhận cập nhật trạng thái?",
        text: `Bạn có chắc chắn muốn cập nhật trạng thái đơn hàng thành "${selectedStatus}" không?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Có",
        cancelButtonText: "Hủy",
      }).then(async (result: SweetAlertResult) => {
        if (result.isConfirmed) {
          dispatch(
            updateStatusByIdThunk({
              orderId: order._id as string,
              stateOrder: selectedStatus,
            })
          )
            .unwrap()
            .then((response) => {
              toast.success(response.stateOrder || "Cập nhật thành công!");
            })
            .catch((error) => {
              toast.error(error || "Cập nhật thất bại!");
            });
        }
      });
    }
  };

  const renderStatusButton = () => {
    switch (order.stateOrder) {
      case "Chờ xử lý":
        return (
          <Button
            onClick={() => {
              setSelectedStatus("Đã xác nhận");
              handleUpdateStatus();
            }}
            className="mt-4 bg-green-500 text-white"
          >
            Đã xác nhận
          </Button>
        );
      case "Đã xác nhận":
        return (
          <Button
            onClick={() => {
              setSelectedStatus("Đang vận chuyển");
              handleUpdateStatus();
            }}
            className="mt-4 bg-yellow-500 text-white"
          >
            Đang vận chuyển
          </Button>
        );
      case "Đang vận chuyển":
        return (
          <Button
            onClick={() => {
              setSelectedStatus("Hoàn tất");
              handleUpdateStatus();
            }}
            className="mt-4 bg-blue-500 text-white"
          >
            Hoàn tất
          </Button>
        );
      case "Hoàn tất":
        return <p className="mt-4 text-gray-500">Đơn hàng đã hoàn tất</p>;
      default:
        return null;
    }
  };

  return (
    <main className="w-full flex-grow p-6">
      {order ? (
        <div>
          {/* Thông tin chung về đơn hàng */}
          <div className="mb-6">
            <p className="text-lg mb-2">
              <span className="font-medium">Mã đơn hàng:</span> #{order._id}
            </p>
            <p className="text-lg mb-2">
              <span className="font-medium">Ngày đặt:</span>{" "}
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
            <p className="text-lg text-red-600 mb-2">
              <span className="font-medium">Tổng tiền:</span>{" "}
              {order.totalAmount?.toLocaleString() || "0"} VND
            </p>

            {/* Trạng thái đơn hàng */}
            <div className="mb-4">
              <label className="text-lg font-medium mb-2 block">
                Trạng thái:
              </label>
              <p>{order.stateOrder}</p>
            </div>

            {/* Nút cập nhật trạng thái */}
            {renderStatusButton()}
          </div>

          {/* Thông tin khách hàng */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4">Thông tin khách hàng</h3>
            <p className="text-lg mb-2">
              <span className="font-medium">Họ tên:</span>{" "}
              {order.shipping?.recipientName || "N/A"}
            </p>
            <p className="text-lg mb-2">
              <span className="font-medium">Số điện thoại:</span>{" "}
              {order.shipping?.phoneNumber || "N/A"}
            </p>
            <p className="text-lg">
              <span className="font-medium">Địa chỉ giao hàng:</span>{" "}
              {order.shipping?.address || "N/A"}
            </p>
          </div>

          {/* Phương thức thanh toán */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4">
              Phương thức thanh toán
            </h3>
            <p className="text-lg">{order.payment?.payment_method || "N/A"}</p>
          </div>

          {/* Sản phẩm */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4">Sản phẩm</h3>
            <ListGroup className="space-y-4">
              {product.items && product.items.length > 0 ? (
                product.items.map((item: any, index: number) => (
                  <ListGroup.Item
                    key={item?.product?._id || index}
                    className="flex justify-between items-center p-4 bg-gray-100 rounded-md shadow-sm"
                  >
                    <div className="flex items-center space-x-4">
                      {item?.product?.image &&
                      item?.product?.image.length > 0 ? (
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
                <p className="text-lg">Không có sản phẩm nào trong đơn hàng</p>
              )}
            </ListGroup>
          </div>

          <Button className="mt-6" onClick={handleBackToList} color="gray">
            Quay lại danh sách đơn hàng
          </Button>

          <ToastContainer />
        </div>
      ) : (
        <p>Không có đơn hàng được chọn</p>
      )}
    </main>
  );
};

export default OrderDetails;
