import React, { useEffect, useState } from "react";
import { Order } from "../../../../../../types/order/order";
import { Button, ListGroup } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { Progress } from "@nextui-org/react";

interface DetailOrderProps {
  order: Order | null;
  onBack: () => void;
}

const DetailOrder: React.FC<DetailOrderProps> = ({ order, onBack }) => {
  if (!order) return null;
  const [progressValue, setProgressValue] = useState<number>(0);
  const navigate = useNavigate();
  const handleRepurchase = (productId: string) => {
    navigate(`/detailProd/${productId}`);
  };
  // useEffect(() => {
  //   switch (order?.stateOrder) {
  //     case "Chờ xử lý":
  //       setProgressValue(25);
  //       break;
  //     case "Đã xác nhận":
  //       setProgressValue(50);
  //       break;
  //     case "Đang vận chuyển":
  //       setProgressValue(75);
  //       break;
  //     case "Hoàn tất":
  //       setProgressValue(100);
  //       break;
  //     default:
  //       setProgressValue(0);
  //   }
  // }, [order?.stateOrder]);
  useEffect(() => {
    switch (order?.stateOrder) {
      case "Chờ xử lý":
        setProgressValue(25);
        break;
      case "Đã xác nhận":
        setProgressValue(50);
        break;
      case "Đang vận chuyển":
        setProgressValue(75);
        break;
      case "Hoàn tất":
        setProgressValue(100);
        break;
      default:
        setProgressValue(0);
    }
  }, [order?.stateOrder]);

  return (
    <main className="w-full flex-grow p-6 bg-gray-50">
      {/* Tiêu đề chính */}
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Chi tiết đơn hàng
      </h2>

      {/* Thông tin chung */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Thông tin đơn hàng
        </h3>
        <div className="space-y-2">
          <p>
            <span className="font-medium text-gray-600">Mã đơn hàng:</span>{" "}
            <span className="text-gray-800">#{order._id}</span>
          </p>
          <p>
            <span className="font-medium text-gray-600">Ngày đặt hàng:</span>{" "}
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
          <p className="text-red-600 font-medium">
            Tổng tiền:{" "}
            {order.cartDetails[0].items[0].totalItemPrice.toLocaleString(
              "vi-VN",
              {
                style: "currency",
                currency: "VND",
              }
            )}
          </p>

          <p>
            <span className="font-medium text-gray-600">Trạng thái:</span>{" "}
            <span className="text-blue-600 font-medium">
              {order.stateOrder}
            </span>
          </p>
        </div>
        <div className="mt-4">
          <label className="text-lg font-medium mb-2 block">
            Tiến trình giao hàng:
          </label>
          <Progress
            aria-label="Order Progress"
            size="lg"
            value={progressValue}
            color="success"
            showValueLabel={true}
            className="max-w-md"
          />
        </div>
      </div>

      {/* Thông tin khách hàng */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Thông tin khách hàng
        </h3>
        <div className="space-y-2">
          <p>
            <span className="font-medium text-gray-600">Họ tên:</span>{" "}
            {order.shipping?.recipientName}
          </p>
          <p>
            <span className="font-medium text-gray-600">Số điện thoại:</span>{" "}
            {order.shipping?.phoneNumber}
          </p>
          <p>
            <span className="font-medium text-gray-600">Địa chỉ:</span>{" "}
            {order.shipping?.address}
          </p>
        </div>
      </div>

      {/* Phương thức thanh toán */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Phương thức thanh toán
        </h3>
        <p>{order.payment?.payment_method}</p>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Sản phẩm</h3>
        <ListGroup className="space-y-4">
          {order.cartDetails.map((cartDetail) =>
            cartDetail.items.map((item) => (
              <ListGroup.Item
                key={item.product._id}
                className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow-md"
              >
                <div className="flex items-center space-x-4">
                  {/* Hình ảnh sản phẩm */}
                  <img
                    src={
                      item?.productVariant?.image?.[0]?.image?.[0] ||
                      "https://img.lovepik.com/free-png/20220126/lovepik-404-page-not-accessible-png-image_401803272_wh1200.png"
                    }
                    onClick={() => handleRepurchase(item.product._id)}
                    alt={`product ${
                      item.productVariant?.variant_name || "Unknown"
                    }`}
                    className="w-20 h-20 object-cover rounded-lg border border-gray-200 cursor-pointer"
                  />

                  <div>
                    <h4 className="font-medium text-lg text-gray-800 mb-1">
                      {item.productVariant.variant_name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Số lượng: {item.quantity}
                    </p>
                  </div>
                </div>
                <p className="text-lg font-medium text-gray-700">
                  {item.productVariant.variant_price.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </p>
              </ListGroup.Item>
            ))
          )}
        </ListGroup>
      </div>

      {/* Nút quay lại */}
      <Button
        className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
        onClick={onBack}
      >
        Quay lại danh sách đơn hàng
      </Button>
    </main>
  );
};

export default DetailOrder;
