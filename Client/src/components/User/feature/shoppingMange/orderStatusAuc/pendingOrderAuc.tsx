import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../../redux/store";
import {fetchOrderDataPendingThunk } from "../../../../../redux/statusOrderUser/pendingStatus/pendingStatusThunk";
// import { softDelThunk } from "../../../../../redux/statusOrderUser/softDelByUser/softDellOrderThunk";
import {OrderProductPendding, OrderDataAllPendding } from "../../../../../types/iterationOrder/pendingStatusOrder";

import currencyFormatter from "currency-formatter";
import { useNavigate } from "react-router-dom";
import { ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteOrderModal from './modalSoftDel/orderSoftDelModal'; // Ensure correct path
function formatCurrency(value: number) {
  return currencyFormatter.format(value, { code: "VND", symbol: "" });
}

const OrderListPendingStatus: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const ordersFromStore = useSelector(
    (state: RootState) => state.pendingStatusOrder.orderPending
  );



// const orderIds = ordersFromStore[0].orderId
 
  const navigate = useNavigate();
  const userId = useSelector(
    (state: RootState) => state.auth.profile.profile?._id
  );
  // const orderId = useSelector(
  //   (state: RootState) => state.orderAuction.orderData?.orderAuctionID
  // );

  // console.log('orderId', orderId);
  
  const [showAll, setShowAll] = useState(false);
  const [orders, setOrders] = useState<OrderDataAllPendding[]>([]);

  // const [, setLocalOrder] = useState(orders);
  const [selectedOrderId, setSelectedOrderId] = useState<OrderDataAllPendding | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  useEffect(() => {
    // Set orders to ordersFromStore or an empty array if it's null
    if (Array.isArray(ordersFromStore) && ordersFromStore.length > 0) {
      setOrders(ordersFromStore);
    } else {
      setOrders([]);
    }
  }, [ordersFromStore]);

  useEffect(() => {
    if (userId) {
      dispatch(fetchOrderDataPendingThunk(userId));
    }
  }, [dispatch, userId]);

  const goBack = () => {
    navigate("/auction");
  };
  const handleDeleteClick = (orderId: OrderDataAllPendding) => {
    setIsModalOpen(true);
    
    setSelectedOrderId(orderId);

   
    setOrders((prevOrders) =>
      prevOrders.filter((o) => o.orderId !== orderId.orderId) // Assuming orderId is a property of order
    );
  
 
 
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrderId(null);
  };
  // const handleSoftDelOrder = (orderId: string) => {
  //   if (orderId && userId ) {

      
  //     // Assuming orderId is an array and you want to delete multiple orders
  //     dispatch(softDelThunk({orderId})).unwrap();
  //     // dispatch(fetchOrderDataShippingThunk(userId));
   
  //     toast.success("Xóa đơn hàng thành công");
  //   }


  // };
  return (
    <div className="mt-6 border border-gray-300 pt-7 rounded-lg shadow-md bg-white">
      {orders
        .filter((order: OrderDataAllPendding) => order.stateOrder === "Chờ xử lý") // Filter orders with 'Vận chuyển' state
        .map((order: OrderDataAllPendding, index: number) => (
          <div key={index} className="order-item mb-6 px-4 md:px-11">
            <div className="flex flex-col md:flex-row items-center justify-between mb-6">
              <div className="order-info mb-4 md:mb-0">
                <p className="font-semibold text-xl text-gray-800">
                  Tên người nhận:{" "}
                  <span className="font-normal">{order.recipientName}</span>
                </p>
                <p className="font-semibold text-xl text-gray-800 mt-3">
                  Trạng thái:{" "}
                  <span className="font-normal ">{order.stateOrder}</span>
                </p>
                <p className="font-semibold text-xl text-gray-800 mt-3">
                  Email: <span className="font-normal">{order.email}</span>
                </p>
              </div>
            </div>

            <div className="border-t border-gray-300 pt-6">
              {order.products
                .slice(0, showAll ? order.products.length : 2)
                .map((product: OrderProductPendding, index: number) => (
                  <div
                    key={index}
                    className="flex flex-col items-center gap-4 sm:flex-row mb-4 w-full border-b border-gray-200 pb-4"
                  >
                    <img
                      src={product.image[0]}
                      alt={product.name}
                      className="w-24 h-24 object-cover sm:w-32 sm:h-32 rounded-md shadow-sm"
                    />
                    <div className="flex-1">
                      <h6 className="font-semibold text-lg sm:text-xl text-gray-800">
                        {product.name}
                      </h6>
                      <p className="font-medium text-md text-gray-600 mt-1">
                        <span className="text-gray-800">Số lượng:</span>{" "}
                        {product.quantity} đơn vị
                      </p>
                      <p className="font-medium text-md text-gray-600 mt-1">
                        <span className="text-gray-800">Phí vận chuyển:</span>{" "}
                        {formatCurrency(product.shippingFee)} đ
                      </p>
                      <p className="font-medium text-md text-gray-600 mt-1">
                        <span className="text-gray-800">
                          Phương thức thanh toán:
                        </span>{" "}
                        {product.paymentMethod}
                      </p>
                      <p className="font-medium text-md text-red-600 mt-1">
                        <span className="text-gray-800">Tổng tiền:</span>{" "}
                        {formatCurrency(product.totalPrice)} đ
                      </p>
                    </div>
                    <div className="flex items-center space-x-4 w-full md:w-auto md:flex-row mt-4 md:mt-0 md:ml-auto justify-center md:justify-end">
 
                      <button
                      onClick={() => handleDeleteClick(order)} // Truy cập _id từ đối tượng order
                        className="flex items-center justify-center whitespace-nowrap rounded-full px-4 py-3 bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition duration-200 ease-in-out"
                      >
                        Trả hàng
                      </button>
                      <button
                        onClick={() => goBack()}
                        className="flex items-center justify-center whitespace-nowrap rounded-full px-4 py-3 bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition duration-200 ease-in-out"
                      >
                        Tiếp tục mua sắm
                      </button>
                    </div>
                  </div>
                ))}

              {/* Only show the toggle button if there are more than 2 products */}
              {order.products.length > 2 && (
                <button
                  onClick={toggleShowAll}
                  className="mt-4 text-indigo-600 hover:text-indigo-800"
                >
                  {showAll ? "Ẩn bớt sản phẩm" : "Xem tất cả sản phẩm"}
                </button>
              )}
            </div>
          </div>
        ))}

        <ToastContainer />
        {isModalOpen && selectedOrderId && (
  <DeleteOrderModal
  orderId={selectedOrderId.orderId}
  onClose={handleCloseModal}
  isOpen={isModalOpen}
/>
)}
    </div>
  );
};

export default OrderListPendingStatus;
