import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { AppDispatch, RootState } from "../../../../redux/store";
import { getOrderAuctionDetailsAdmin } from "../../../../redux/orderAucAdmin/orderAucAdminThunk";
import { updateOrderStatusThunk } from "../../../../redux/orderAucAdmin/updateStatusAdmin/updateStatusAdminThunk";
import { Card, ListGroup, Select , Button} from "flowbite-react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
const OrderDetails: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const orders = useSelector((state: RootState) => state.orderAucAdmin);
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  useEffect(() => {
    if (id) {
      dispatch(getOrderAuctionDetailsAdmin(id));
    }
  }, [dispatch, id]);

  const selectedOrder = orders.confirmOrder;
  const selectedOrderStatus = Array.isArray(orders.orders)
    ? orders.orders.find((order) => order._id === id)
    : orders.orders;
  useEffect(() => {
    if (selectedOrderStatus) {
      setSelectedStatus(selectedOrderStatus?.stateOrder || "");
    }
  }, [selectedOrderStatus]);

  const handleStatusChange = async(e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;

    setSelectedStatus(newStatus);
  
  };

  const handleUpdateStatus = async() => {

    if (selectedOrderStatus ) {
 
     

     
    await dispatch(updateOrderStatusThunk({  
        orderId: selectedOrderStatus._id as string,
        stateOrder: selectedStatus  })).unwrap()
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
      <Card className="p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Chi tiết đơn hàng</h2>
        {selectedOrder ? (
          <div>
            <div className="mb-6">
              <p className="text-lg mb-2">
                <span className="font-medium">Mã đơn hàng:</span> #
                {selectedOrder.orderid}
              </p>
              <p className="text-lg mb-2">
                <span className="font-medium">Trạng thái đơn hiện tại:</span> #
                {selectedOrder.state}
              </p>

              <p className="text-lg mb-2">
                <span className="font-medium">Ngày mua sắm:</span>{" "}
                {new Date(selectedOrder.dateOrder).toLocaleDateString()} VND
              </p>
              <p className="text-lg text-red-600 mb-2">
                <span className="font-medium">Tổng tiền:</span>{" "}
                {selectedOrder?.totalPrice ? selectedOrder.totalPrice.toLocaleString() : "N/A"} VND
              </p>
              <div className="mb-4">
                <p className="text-lg font-medium mb-2">Tổng quan trạng thái</p>
                <Select value={selectedStatus} onChange={handleStatusChange}>
                <option >Trạng thái đơn hàng</option>
                  <option value="Vận chuyển">Vận chuyển</option>
                  <option value="Nhận hàng">Nhận hàng</option>
                  <option value="Hoàn tất">Hoàn tất</option>
                  <option value="Hủy đơn hàng">Hủy đơn hàng</option>
                </Select>
                <Button onClick={handleUpdateStatus}
                   className="mt-4 bg-blue-500 text-white p-2 rounded-md">
                    Cập nhật trạng thái</Button>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Thông tin khách hàng</h3>
              <p className="text-lg mb-2">
                <span className="font-medium">Họ tên:</span> {selectedOrder.shippingInfo?.recipientName}
              </p>
              <p className="text-lg mb-2">
                <span className="font-medium">Số điện thoại:</span> {selectedOrder.shippingInfo?.phoneNumber}
              </p>
              <p className="text-lg">
                <span className="font-medium">Địa chỉ:</span> {selectedOrder.shippingInfo?.address}
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Sản phẩm</h3>
              <ListGroup className="space-y-4">
                {selectedOrder.products.map((product, index) => (
                  <ListGroup.Item key={index} className="flex justify-between items-center p-4 bg-gray-100 rounded-md shadow-sm">
                    <div className="flex items-center space-x-4">
                      <img src={product.image[0]} alt={product.name} 
                      className="w-32 h-20 object-cover rounded-md" />
                      <div>
                        <h4 className="font-medium  text-base
                         mb-1 lex items-center border rounded-lg px-3 py-2 text-center">{product.name}</h4>
                      </div>
                    </div>
                    <p className="font-medium  text-base">{product.price.toLocaleString()} VND</p>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </Card>
      <ToastContainer />
    </main>
  );
};

export default OrderDetails;
