import React from "react";
import { Order } from "../../../../../../types/order/order";
import { Button, Card, ListGroup } from "flowbite-react";
import { useNavigate } from "react-router-dom";

interface DetailOrderProps {
  order: Order | null;
  onBack: () => void;
}

const DetailOrder: React.FC<DetailOrderProps> = ({ order, onBack }) => {
  if (!order) return null;
  const navigate = useNavigate();
  const handleRepurchase = (productId: string) => {
    navigate(`/detailProd/${productId}`);
  };
  return (
    <Card className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Chi tiết đơn hàng</h2>

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
          {order.totalAmount.toLocaleString()} VND
        </p>
        <p className="text-lg">
          <span className="font-medium">Trạng thái:</span> {order.stateOrder}
        </p>
      </div>

      {/* Thông tin khách hàng */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">Thông tin khách hàng</h3>
        <p className="text-lg mb-2">
          <span className="font-medium">Họ tên:</span>{" "}
          {order.shipping?.recipientName}
        </p>
        <p className="text-lg mb-2">
          <span className="font-medium">Số điện thoại:</span>{" "}
          {order.shipping?.phoneNumber}
        </p>
        <p className="text-lg">
          <span className="font-medium">Địa chỉ giao hàng:</span>{" "}
          {order.shipping?.address}
        </p>
      </div>

      {/* Phương thức thanh toán */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">Phương thức thanh toán</h3>
        <p className="text-lg">{order.payment.payment_method}</p>
      </div>

      {/* Danh sách sản phẩm trong đơn hàng */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">Sản phẩm</h3>
        <ListGroup className="space-y-4">
          {order.cartDetails.map((item) => (
            <ListGroup.Item
              key={item.product._id}
              className="flex justify-between items-center p-4 bg-gray-100 rounded-md shadow-sm"
            >
              <div className="flex items-center space-x-4">
                <img
                  onClick={
                    () => handleRepurchase(item.product._id) // Thay đổi từ order.cartDetails[0].product._id thành item.product._id
                  }
                  src={item.product.image[0]}
                  alt={item.product.product_name}
                  className="w-16 h-16 object-cover rounded-md"
                />
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

      {/* Nút quay lại */}
      <Button className="mt-6" color="gray" onClick={onBack}>
        Quay lại danh sách đơn hàng
      </Button>
    </Card>
  );
};

export default DetailOrder;
