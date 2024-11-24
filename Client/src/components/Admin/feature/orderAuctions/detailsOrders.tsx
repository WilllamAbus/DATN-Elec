import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams,  useNavigate} from "react-router-dom";
import { AppDispatch, RootState } from "../../../../redux/store";
import { getOrderAuctionDetailsAdmin } from "../../../../redux/orderAucAdmin/getAllOrder/orderAucAdminThunk";
import { updateOrderStatusThunk } from "../../../../redux/orderAucAdmin/updateStatusAdmin/updateStatusAdminThunk";
import { Card, ListGroup } from "flowbite-react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
// import withReactContent from "sweetalert2-react-content";
// import Swal from "sweetalert2";
import { Button, Progress } from "@nextui-org/react";
// const MySwal = withReactContent(Swal);
const OrderDetails: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const orders = useSelector((state: RootState) => state.orderAucAdmin);

  
  // const [selectedStatus, setSelectedStatus] = useState<string>("");


  const [progressValue, setProgressValue] = useState<number>(0);
  const navigate = useNavigate();
  useEffect(() => {
    if (id) {
      dispatch(getOrderAuctionDetailsAdmin(id));
    }
  }, [dispatch, id]);

  const selectedOrder = orders.confirmOrder;

  
  // const selectedOrderStatus = Array.isArray(orders.orders)
  //   ? orders.orders.find((order) => order._id === id)
  //   : orders.orders;
  // console.log('selectedOrderStatus', selectedOrderStatus);
  
  // useEffect(() => {
  //   if (selectedOrderStatus) {
  //     setSelectedStatus(selectedOrderStatus?.stateOrder || "");
  //   }
  // }, [selectedOrderStatus]);
  useEffect(() => {
    switch (selectedOrder?.state) {
      case "Chờ xử lý":
        setProgressValue(15);
        break;
      case "Đã xác nhận":
        setProgressValue(25);
        break;
      case "Vận chuyển":
        setProgressValue(55);
        break;
        case "Nhận hàng":
        setProgressValue(75);
        break;
      case "Hoàn tất":
        setProgressValue(100);
        break;
      default:
        setProgressValue(0);
    }
  }, [selectedOrder?.state]);
  // const handleStatusChange = async(e: React.ChangeEvent<HTMLSelectElement>) => {
  //   const newStatus = e.target.value;

  //   setSelectedStatus(newStatus);
  
  // };
  const handleBackToList = () => {
    navigate("/admin/listOrderAuction");
  };
  const handleUpdateStatus = async(newStatus: string) => {

    if (selectedOrder ) {
 
      await dispatch(updateOrderStatusThunk({  
        orderId: selectedOrder.orderid as string,
        stateOrder: newStatus  })).unwrap()
        toast.success(
    "Cập nhật thành công!"
        );
   
        await dispatch(
          getOrderAuctionDetailsAdmin(selectedOrder?.orderid as string)
        ).unwrap();

 
     }

  };

  const renderStatusButton = () => {
    switch (selectedOrder?.state) {
      case "Chờ giao hàng":
        return (
          <Button
            onClick={() => {
              // setSelectedStatus("Chờ xử lý");
              handleUpdateStatus("Chờ xử lý");
            }}
            className="mt-4 bg-green-500 text-white"
          >
             Chờ xử lý
          </Button>
        );
      case "Chờ xử lý":
        return (
          <Button
            onClick={() => {
              // setSelectedStatus();
              handleUpdateStatus("Đã xác nhận");
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
              // setSelectedStatus();
              handleUpdateStatus("Vận chuyển");
            }}
            className="mt-4 bg-yellow-500 text-white"
          >
            Đang vận chuyển
          </Button>
        );
      case "Vận chuyển":
        return (
          <>
            <Button
              onClick={() => {
                // setSelectedStatus();
                handleUpdateStatus("Nhận hàng");
              }}
              className="mt-4 bg-blue-500 text-white"
            >
              Nhận hàng
            </Button>
           
          </>
        );
      case "Nhận hàng":
        return (
          <>
            <Button
              onClick={() => {
                // setSelectedStatus();
                handleUpdateStatus("Hoàn tất");
              }}
              className="mt-4 bg-blue-500 text-white"
            >
              Hoàn tất
            </Button>
            {/* Nút Hoàn tiền */}
            {/* {selectedOrder?.payment.payment_method !==
              "Thanh toán khi nhận hàng" && (
              <Button
                onClick={() => {
                  setSelectedStatus("Đã hoàn tiền");
                  handleUpdateStatus();
                }}
                className="mt-4 bg-red-500 text-white"
              >
                Hoàn tiền
              </Button>
            )} */}
          </>
        );
      
      // case "Hủy đơn hàng":
      //   return (
      //     <>
      //       {selectedOrder?.payment.payment_method !==
      //         "Thanh toán khi nhận hàng" && (
      //         <Button
      //           onClick={() => {
      //             setSelectedStatus("Đã hoàn tiền");
      //             handleUpdateStatus();
      //           }}
      //           className="mt-4 bg-red-500 text-white"
      //         >
      //           Hoàn tiền
      //         </Button>
      //       )}
      //     </>
      //   );
      default:
        return null;
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
             
            {renderStatusButton()}
              {/* <div className="mb-4">
                <p className="text-lg font-medium mb-2">Tổng quan trạng thái</p>
                <Select value={selectedStatus} onChange={handleStatusChange}>
                <option >Trạng thái đơn hàng</option>
                <option value="Chờ xử lý">Chờ xử lý</option>
                <option value="Đã xác nhận">Đã xác nhận</option>
                  <option value="Vận chuyển">Vận chuyển</option>
                  <option value="Nhận hàng">Nhận hàng</option>
                  <option value="Hoàn tất">Hoàn tất</option>
             
                </Select>
                <Button onClick={handleUpdateStatus}
                   className="mt-4 bg-blue-500 text-white p-2 rounded-md">
                    Cập nhật trạng thái</Button>
              </div> */}

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
            {selectedOrder?.paymetMethod!==
          "Thanh toán trực tiếp" && (
          <section className="mb-8 bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Ngân Hàng Thanh Toán
            </h2>
            <div className="space-y-2">
              <p className="text-lg mb-2 text-gray-700">
                <span className="font-medium">Tên ngân hàng:</span>{" "}
                {selectedOrder?.refundBank?.bankName || "N/A"}
              </p>
              <p className="text-lg mb-2 text-gray-700">
                <span className="font-medium">Họ tên:</span>{" "}
                {selectedOrder?.refundBank?.accountName || "N/A"}
              </p>
              <p className="text-lg text-gray-700">
                <span className="font-medium">Số tài khoản:</span>{" "}
                {selectedOrder?.refundBank?.accountNumber || "N/A"}
              </p>
            </div>
          </section>
        )}
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
<br />

      <button
          onClick={handleBackToList}
          className="w-80 bg-blue-600 text-white py-3 rounded-md shadow-lg hover:bg-blue-700 transition duration-300"
        >
          Quay lại danh sách đơn hàng
        </button>
      <ToastContainer />
    </main>
  );
};

export default OrderDetails;
