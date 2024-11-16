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
// import Swal from "sweetalert2";
// // import { fetchPaginatedOrder } from "../../../../redux/order/pagiOrder/pagination";
// // import { listOrderThunk } from "../../../../redux/order/orderThunks";
// const MySwal = withReactContent(Swal);

// const OrderDetails: React.FC = () => {
//   const dispatch: AppDispatch = useDispatch();
//   const { id } = useParams<{ id: string }>();
//   const order = useSelector((state: RootState) => state.order.orders[0]);
//   const product = useSelector((state: RootState) => state.order);
//   // const information = useSelector((state: RootState) => state.order);
//   const [selectedStatus, setSelectedStatus] = useState<string>("");
//   // const [searchTerm] = useState("");
//   // const currentPage = useSelector(
//   //   (state: RootState) => state.orderPagi.pagination?.currentPage || 1
//   // );

//   const navigate = useNavigate();

//   useEffect(() => {
//     if (id) {
//       dispatch(getOrderDetailByIdThunk(id));
//     }
//   }, [dispatch, id]);

//   const handleBackToList = () => {
//     navigate("/admin/listOrders");
//   };

//   const handleUpdateStatus = async () => {
//     if (order && order._id && selectedStatus) {
//       const result = await MySwal.fire({
//         title: "Xác nhận cập nhật trạng thái?",
//         text: `Bạn có chắc chắn muốn cập nhật trạng thái đơn hàng thành "${selectedStatus}" không?`,
//         icon: "warning",
//         showCancelButton: true,
//         confirmButtonColor: "#3085d6",
//         cancelButtonColor: "#d33",
//         confirmButtonText: "Có",
//         cancelButtonText: "Hủy",
//       });

//       if (result.isConfirmed) {
//         try {
//           const response = await dispatch(
//             updateStatusByIdThunk({
//               orderId: order._id as string,
//               stateOrder: selectedStatus,
//             })
//           ).unwrap();
//           toast.success(
//             response.stateOrder
//               ? `Trạng thái đơn hàng đã được cập nhật thành "${response.stateOrder}"!`
//               : "Cập nhật thành công!"
//           );
//           await dispatch(getOrderDetailByIdThunk(order._id)).unwrap();
//         } catch (error) {
//           let errorMessage = "Đã xảy ra lỗi khi cập nhật trạng thái đơn hàng.";

//           if (error instanceof Error) {
//             errorMessage = error.message;
//           }

//           toast.error(errorMessage);
//         }
//       }
//     }
//   };

//   const renderStatusButton = () => {
//     switch (order.stateOrder) {
//       case "Chờ xử lý":
//         return (
//           <Button
//             onClick={() => {
//               setSelectedStatus("Đã xác nhận");
//               handleUpdateStatus();
//             }}
//             className="mt-4 bg-green-500 text-white"
//           >
//             Đã xác nhận
//           </Button>
//         );
//       case "Đã xác nhận":
//         return (
//           <Button
//             onClick={() => {
//               setSelectedStatus("Đang vận chuyển");
//               handleUpdateStatus();
//             }}
//             className="mt-4 bg-yellow-500 text-white"
//           >
//             Đang vận chuyển
//           </Button>
//         );
//       case "Đang vận chuyển":
//         return (
//           <Button
//             onClick={() => {
//               setSelectedStatus("Hoàn tất");
//               handleUpdateStatus();
//             }}
//             className="mt-4 bg-blue-500 text-white"
//           >
//             Hoàn tất
//           </Button>
//         );
//       case "Hoàn tất":
//         return <p className="mt-4 text-gray-500">Đơn hàng đã hoàn tất</p>;
//       default:
//         return null;
//     }
//   };

//   return (
//     <main className="w-full flex-grow p-6">
//       {order ? (
//         <div>
//           {/* Thông tin chung về đơn hàng */}
//           <div className="mb-6">
//             <p className="text-lg mb-2">
//               <span className="font-medium">Mã đơn hàng:</span> #{order._id}
//             </p>
//             <p className="text-lg mb-2">
//               <span className="font-medium">Ngày đặt:</span>{" "}
//               {new Date(order.createdAt).toLocaleDateString()}
//             </p>
//             <p className="text-lg text-red-600 mb-2">
//               <span className="font-medium">Tổng tiền:</span>{" "}
//               {order.totalAmount?.toLocaleString() || "0"} VND
//             </p>

//             {/* Trạng thái đơn hàng */}
//             <div className="mb-4">
//               <label className="text-lg font-medium mb-2 block">
//                 Trạng thái:
//               </label>
//               <p>{order.stateOrder}</p>
//             </div>

//             {/* Nút cập nhật trạng thái */}
//             {renderStatusButton()}
//           </div>

//           {/* Thông tin khách hàng */}
//           <div className="mb-6">
//             <h3 className="text-xl font-semibold mb-4">Thông tin khách hàng</h3>
//             <p className="text-lg mb-2">
//               <span className="font-medium">Họ tên:</span>{" "}
//               {order.shipping?.recipientName || "N/A"}
//             </p>
//             <p className="text-lg mb-2">
//               <span className="font-medium">Số điện thoại:</span>{" "}
//               {order.shipping?.phoneNumber || "N/A"}
//             </p>
//             <p className="text-lg">
//               <span className="font-medium">Địa chỉ giao hàng:</span>{" "}
//               {order.shipping?.address || "N/A"}
//             </p>
//           </div>

//           {/* Phương thức thanh toán */}
//           <div className="mb-6">
//             <h3 className="text-xl font-semibold mb-4">
//               Phương thức thanh toán
//             </h3>
//             <p className="text-lg">{order.payment?.payment_method || "N/A"}</p>
//           </div>

//           {/* Sản phẩm */}
//           <div className="mb-6">
//             <h3 className="text-xl font-semibold mb-4">Sản phẩm</h3>
//             <ListGroup className="space-y-4">
//               {product.items && product.items.length > 0 ? (
//                 product.items.map((item: any, index: number) => (
//                   <ListGroup.Item
//                     key={item?.product?._id || index}
//                     className="flex justify-between items-center p-4 bg-gray-100 rounded-md shadow-sm"
//                   >
//                     <div className="flex items-center space-x-4">
//                       <img
//                         src={
//                           item?.productVariant?.image?.[0]?.image?.[0] ||
//                           "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max.png"
//                         }
//                         alt={item?.productVariant?.variant_name || "No Image"}
//                         className="w-16 h-16 object-cover rounded-md"
//                       />

//                       <div>
//                         <h4 className="font-medium text-lg mb-1">
//                           {item?.productVariant?.variant_name || "N/A"}
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
//                 <p className="text-lg">Không có sản phẩm nào trong đơn hàng</p>
//               )}
//             </ListGroup>
//           </div>

//           <Button className="mt-6" onClick={handleBackToList} color="gray">
//             Quay lại danh sách đơn hàng
//           </Button>

//           <ToastContainer />
//         </div>
//       ) : (
//         <p>Không có đơn hàng được chọn</p>
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
import Swal from "sweetalert2";

const MySwal = withReactContent(Swal);

const OrderDetails: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  //sảnpham
  // const orders = useSelector((state: RootState) => state.order.order);
  // //thongtin
  // const items = useSelector((state: RootState) => state.order);
  const { order, items } = useSelector((state: RootState) => state.order);
  console.log("Order data:", order, items);

  const selectedOrder = Array.isArray(order)
    ? order.find((order) => order._id === id)
    : order;
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      dispatch(getOrderDetailByIdThunk(id));
    }
  }, [dispatch, id]);

  const handleBackToList = () => {
    navigate("/admin/listOrders");
  };

  const handleUpdateStatus = async () => {
    if (selectedOrder && selectedOrder?._id && selectedStatus) {
      const result = await MySwal.fire({
        title: "Xác nhận cập nhật trạng thái?",
        text: `Bạn có chắc chắn muốn cập nhật trạng thái đơn hàng thành "${selectedStatus}" không?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Có",
        cancelButtonText: "Hủy",
      });

      if (result.isConfirmed) {
        try {
          const response = await dispatch(
            updateStatusByIdThunk({
              orderId: selectedOrder?._id as string,
              stateOrder: selectedStatus,
            })
          ).unwrap();
          toast.success(
            response.stateOrder
              ? `Trạng thái đơn hàng đã được cập nhật thành "${response.stateOrder}"!`
              : "Cập nhật thành công!"
          );
          await dispatch(
            getOrderDetailByIdThunk(selectedOrder?._id as string)
          ).unwrap();
        } catch (error) {
          let errorMessage = "Đã xảy ra lỗi khi cập nhật trạng thái đơn hàng.";
          if (error instanceof Error) {
            errorMessage = error.message;
          }
          toast.error(errorMessage);
        }
      }
    }
  };

  const renderStatusButton = () => {
    switch (selectedOrder?.stateOrder) {
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

  if (!order) {
    return (
      <main className="w-full flex-grow p-6">
        <p>Không tìm thấy đơn hàng.</p>
      </main>
    );
  }

  return (
    <main className="w-full flex-grow p-6">
      <div className="mb-6">
        <p className="text-lg mb-2">
          <span className="font-medium">Mã đơn hàng:</span> #
          {selectedOrder?._id || "null"}
        </p>
        <p className="text-lg mb-2">
          <span className="font-medium">Ngày đặt:</span>{" "}
          {new Date(selectedOrder?.createdAt || "null").toLocaleDateString()}
        </p>
        <p className="text-lg text-red-600 mb-2">
          <span className="font-medium">Tổng tiền:</span>{" "}
          {selectedOrder?.totalAmount?.toLocaleString() || "0"} VND
        </p>

        <div className="mb-4">
          <label className="text-lg font-medium mb-2 block">Trạng thái:</label>
          <p>{selectedOrder?.stateOrder}</p>
        </div>

        {renderStatusButton()}
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">Thông tin khách hàng</h3>
        <p className="text-lg mb-2">
          <span className="font-medium">Họ tên:</span>{" "}
          {selectedOrder?.shipping?.recipientName || "N/A"}
        </p>
        <p className="text-lg mb-2">
          <span className="font-medium">Số điện thoại:</span>{" "}
          {selectedOrder?.shipping?.phoneNumber || "N/A"}
        </p>
        <p className="text-lg">
          <span className="font-medium">Địa chỉ giao hàng:</span>{" "}
          {selectedOrder?.shipping?.address || "N/A"}
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">Phương thức thanh toán</h3>
        <p className="text-lg">
          {selectedOrder?.payment?.payment_method || "N/A"}
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">Sản phẩm</h3>
        <ListGroup className="space-y-4">
          {items && items.length > 0 ? (
            items.map((item: any, index: number) => (
              <ListGroup.Item
                key={item?.product?._id || index}
                className="flex justify-between items-center p-4 bg-gray-100 rounded-md shadow-sm"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={
                      item?.productVariant?.image?.[0]?.image?.[0] ||
                      "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max.png"
                    }
                    alt={item?.productVariant?.variant_name || "No Image"}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div>
                    <h4 className="font-medium text-lg mb-1">
                      {item?.productVariant?.variant_name || "N/A"}
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
    </main>
  );
};

export default OrderDetails;
