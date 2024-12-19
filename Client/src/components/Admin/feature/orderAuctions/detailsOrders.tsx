import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams,  useNavigate} from "react-router-dom";
import { AppDispatch, RootState } from "../../../../redux/store";
import { getOrderAuctionDetailsAdmin } from "../../../../redux/orderAucAdmin/getAllOrder/orderAucAdminThunk";
import { updateOrderStatusThunk } from "../../../../redux/orderAucAdmin/updateStatusAdmin/updateStatusAdminThunk";

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
            <Button
              onClick={() => {
                // setSelectedStatus();
                handleUpdateStatus("Giao hàng không thành công");
              }}
              className="mt-4 ml-2 bg-red-500 text-white"
            >
             Giao hàng không thành công
            </Button>
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

  const formatDate = (dateString: any) => {
    if (dateString && dateString.length === 14) {
      // Tách chuỗi theo từng phần (yyyy, MM, dd, HH, mm, ss)
      const year = dateString.slice(0, 4);
      const month = dateString.slice(4, 6);
      const day = dateString.slice(6, 8);
      const hours = dateString.slice(8, 10);
      const minutes = dateString.slice(10, 12);
      const seconds = dateString.slice(12, 14);
  
      // Tạo đối tượng Date từ chuỗi đã tách
      return new Date(`${year}-${month}-${day}T${hours}:${minutes}:${seconds}`);
    }
    return null; // Trả về null nếu chuỗi không hợp lệ
  };
  
  const formattedDate = formatDate(selectedOrder?.refundPay?.paymentDateVnPay);

  return (
    <main className="w-full flex-grow p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
 
        <h2 className="text-2xl font-semibold mb-4">Chi tiết đơn hàng</h2>
        {selectedOrder ? (
        
            <div className="mb-6">
                <section className="mb-8 bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                  <div className="space-y-2">
                  <p className="text-lg mb-2 text-gray-700">
                <span className="font-medium ">Mã đơn hàng:</span> {" "}
                {selectedOrder.orderid}
              </p>
              <p className="text-lg mb-2 text-blue-700">
                <span className="font-medium ">Trạng thái đơn hiện tại:</span>{" "}  
                 {selectedOrder.state}
              </p>

              <p className="text-lg mb-2">
                <span className="font-medium">Ngày mua sắm:</span>{" "}
                {new Date(selectedOrder.dateOrder).toLocaleDateString('vi-VN')}
              </p>
              <p className="text-lg text-red-600 mb-2">
                <span className="font-medium">Tổng tiền:</span>{" "}
                {selectedOrder?.totalPrice ? selectedOrder.totalPrice.toLocaleString() : "N/A"} VND
              </p>
             
              {renderStatusButton()}
      

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
                </section>
      
            <section className="mb-8 bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Thông Tin Khách Hàng
          </h2>
          <div className="space-y-2">
            <p className="text-lg mb-2 text-gray-700">
              <span className="font-medium">Họ tên:</span>{" "}
              {selectedOrder.shippingInfo?.recipientName}
            </p>
            <p className="text-lg mb-2 text-gray-700">
              <span className="font-medium">Số điện thoại:</span>{" "}
              {selectedOrder.shippingInfo?.phoneNumber}
            </p>
            <p className="text-lg text-gray-700">
              <span className="font-medium">Địa chỉ giao hàng:</span>{" "}
              {selectedOrder.shippingInfo?.address}
            </p>
          </div>
        </section>
          
            {selectedOrder?.paymetMethod!==
          "Thanh toán trực tiếp" && (
          <section className="mb-8 bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Ngân Hàng Thanh Toán
            </h2>
            <div className="space-y-2">
              <p className="text-lg mb-2 text-gray-700">
                <span className="font-medium">Tên ngân hàng:</span>{" "}
                {selectedOrder?.refundPay?.bankCode || ""}
              </p>
              <p className="text-lg mb-2 text-gray-700">
                <span className="font-medium">Ngày thanh toán:</span>{" "}
                {formattedDate ? formattedDate.toLocaleDateString('vi-VN') : ""}
              </p>
              <p className="text-lg text-gray-700">
                <span className="font-medium">Giá tiền thanh toán:</span>{" "}
                {selectedOrder?.refundPay?.transiTionAmout 
    ? Number(selectedOrder.refundPay.transiTionAmout).toLocaleString() 
    : ""} VNĐ
              </p>
            </div>
          </section>
        )}

<section className="mb-8 bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Sản Phẩm</h2>
          <div className="space-y-4">
            { selectedOrder.products.map((product, index) =>(
            
                <div
                  key={index}
                  className="flex justify-between items-center p-4 bg-gray-100 rounded-lg shadow-md transition-all duration-200 hover:bg-gray-200"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={product.image[0] ||
                     
                        "https://via.placeholder.com/64"
                      }
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div>
                      <h4 className="font-medium text-lg text-gray-800">
                        {product.name}
                      </h4>
                      <p className="text-gray-600">
                        Số lượng:  1
                      </p>
                    </div>
                  </div>
                  <p className="text-lg text-gray-800">
                    {product.price.toLocaleString()
                     } VNĐ
                  </p>
                </div>
              ))
            }
          </div>
        </section>
        
          </div>
        ) : (
          <p>Loading...</p>
        )}


      </div>
<br />

      <button
          onClick={handleBackToList}
               className="w-full bg-blue-600 text-white py-3 rounded-md shadow-lg hover:bg-blue-700 transition duration-300"
        >
          Quay lại danh sách đơn hàng
        </button>
      <ToastContainer />
    </main>
  );
};

export default OrderDetails;
