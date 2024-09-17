// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams } from "react-router-dom";
// import { AppDispatch, RootState } from "../../../../redux/store";
// import { getOrderDetailByIdThunk } from "../../../../redux/order/orderDetail";
// import { updateStatusByIdThunk } from "../../../../redux/order/Admin/orderAdmin";
// import { Card, ListGroup } from "flowbite-react";

// const OrderDetails: React.FC = () => {
//   const dispatch: AppDispatch = useDispatch();
//   const { id } = useParams<{ id: string }>();
//   const orders = useSelector((state: RootState) => state.order);
//   console.log("Order Data:", orders);

//   useEffect(() => {
//     if (id) {
//       dispatch(getOrderDetailByIdThunk(id));
//     }
//   }, [dispatch, id]);

//   const selectedOrder = Array.isArray(orders.orders)
//     ? orders.orders.find((order) => order._id === id)
//     : orders.orders;

//   return (
//     <main className="w-full flex-grow p-6">
//       <Card className="p-6 bg-white shadow-md rounded-lg">
//         <h2 className="text-2xl font-semibold mb-4">Chi tiết đơn hàng</h2>
//         {selectedOrder ? (
//           <div>
//             {/* Thông tin chung về đơn hàng */}
//             <div className="mb-6">
//               <p className="text-lg mb-2">
//                 <span className="font-medium">Mã đơn hàng:</span> #
//                 {selectedOrder._id}
//               </p>
//               <p className="text-lg mb-2">
//                 <span className="font-medium">Ngày đặt:</span>{" "}
//                 {new Date(selectedOrder.createdAt).toLocaleDateString()}
//               </p>
//               <p className="text-lg text-red-600 mb-2">
//                 <span className="font-medium">Tổng tiền:</span>{" "}
//                 {selectedOrder.totalAmount.toLocaleString()} VND
//               </p>
//               <p className="text-lg">
//                 <span className="font-medium">Trạng thái:</span>{" "}
//                 {selectedOrder.stateOrder}
//               </p>
//             </div>

//             {/* Thông tin khách hàng */}
//             <div className="mb-6">
//               <h3 className="text-xl font-semibold mb-4">
//                 Thông tin khách hàng
//               </h3>
//               <p className="text-lg mb-2">
//                 <span className="font-medium">Họ tên:</span>{" "}
//                 {selectedOrder.shipping?.recipientName}
//               </p>
//               <p className="text-lg mb-2">
//                 <span className="font-medium">Số điện thoại:</span>{" "}
//                 {selectedOrder.shipping?.phoneNumber}
//               </p>
//               <p className="text-lg">
//                 <span className="font-medium">Địa chỉ giao hàng:</span>{" "}
//                 {selectedOrder.shipping?.address}
//               </p>
//             </div>

//             {/* Phương thức thanh toán */}
//             <div className="mb-6">
//               <h3 className="text-xl font-semibold mb-4">
//                 Phương thức thanh toán
//               </h3>
//               <p className="text-lg">{selectedOrder.payment?.payment_method}</p>
//             </div>
//           </div>
//         ) : (
//           <p>No selected order</p>
//         )}

//         {/* Danh sách sản phẩm trong đơn hàng */}
//         <div className="mb-6">
//           <h3 className="text-xl font-semibold mb-4">Sản phẩm</h3>
//           <ListGroup className="space-y-4">
//             {orders.items.map((item: any, index: number) => (
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
//             ))}
//           </ListGroup>
//         </div>
//       </Card>
//     </main>
//   );
// };

// export default OrderDetails;
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { AppDispatch, RootState } from "../../../../redux/store";
import { getOrderDetailByIdThunk } from "../../../../redux/order/orderDetail";
import { updateStatusByIdThunk } from "../../../../redux/order/Admin/orderAdmin";
import { Card, ListGroup, Select } from "flowbite-react";

const OrderDetails: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const orders = useSelector((state: RootState) => state.order);
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  console.log("Order Data:", orders);

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
      setSelectedStatus(selectedOrder.stateOrder || ""); // Gán trạng thái ban đầu khi load đơn hàng
    }
  }, [selectedOrder]);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value);
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
        .then(() => {
          alert("Cập nhật trạng thái đơn hàng thành công!");
        })
        .catch((error) => {
          console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
          alert("Có lỗi xảy ra khi cập nhật trạng thái.");
        });
    }
  };

  return (
    <main className="w-full flex-grow p-6">
      <Card className="p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Chi tiết đơn hàng</h2>
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
                {selectedOrder.totalAmount.toLocaleString()} VND
              </p>

              {/* Trạng thái đơn hàng với select */}
              <div className="mb-4">
                <p className="text-lg font-medium mb-2">Trạng thái:</p>
                <Select value={selectedStatus} onChange={handleStatusChange}>
                  <option value="Chờ xử lý">Chờ xử lý</option>
                  <option value="Đã xác nhận">Đã xác nhận</option>
                  <option value="Đang vận chuyển">Đang vận chuyển</option>
                  <option value="Hoàn tất">Hoàn tất</option>
                  <option value="Trả hàng">Trả hàng</option>
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
              <h3 className="text-xl font-semibold mb-4">
                Thông tin khách hàng
              </h3>
              <p className="text-lg mb-2">
                <span className="font-medium">Họ tên:</span>{" "}
                {selectedOrder.shipping?.recipientName}
              </p>
              <p className="text-lg mb-2">
                <span className="font-medium">Số điện thoại:</span>{" "}
                {selectedOrder.shipping?.phoneNumber}
              </p>
              <p className="text-lg">
                <span className="font-medium">Địa chỉ giao hàng:</span>{" "}
                {selectedOrder.shipping?.address}
              </p>
            </div>

            {/* Phương thức thanh toán */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">
                Phương thức thanh toán
              </h3>
              <p className="text-lg">{selectedOrder.payment?.payment_method}</p>
            </div>
          </div>
        ) : (
          <p>No selected order</p>
        )}

        {/* Danh sách sản phẩm trong đơn hàng */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">Sản phẩm</h3>
          <ListGroup className="space-y-4">
            {orders.items.map((item: any, index: number) => (
              <ListGroup.Item
                key={item.product._id || index}
                className="flex justify-between items-center p-4 bg-gray-100 rounded-md shadow-sm"
              >
                <div className="flex items-center space-x-4">
                  {item.product.image && item.product.image.length > 0 && (
                    <img
                      src={item.product.image[0]}
                      alt={item.product.product_name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  )}
                  <div>
                    <h4 className="font-medium text-lg mb-1">
                      {item.product.product_name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Số lượng: {item.quantity}
                    </p>
                  </div>
                </div>
                <p className="text-lg">
                  {item.product.product_price_unit.toLocaleString()} VND
                </p>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      </Card>
    </main>
  );
};

export default OrderDetails;
