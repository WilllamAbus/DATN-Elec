import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { AppDispatch, RootState } from "../../../../redux/store";
import { getOrderDetailByIdThunk } from "../../../../redux/order/orderDetail";
import { updateStatusByIdThunk } from "../../../../redux/order/Admin/orderAdmin";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { Button, Progress } from "@nextui-org/react";

const MySwal = withReactContent(Swal);

const OrderDetails: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { id } = useParams<{ id: string }>();

  const { order, items } = useSelector((state: RootState) => state.order);

  console.log("Order data:", order, items);

  const selectedOrder = Array.isArray(order)
    ? order.find((order) => order._id === id)
    : order;
  // const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [progressValue, setProgressValue] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      dispatch(getOrderDetailByIdThunk(id));
    }
  }, [dispatch, id]);
  useEffect(() => {
    switch (selectedOrder?.stateOrder) {
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
  }, [selectedOrder?.stateOrder]);
  const handleBackToList = () => {
    navigate("/admin/listOrders");
  };

  // const handleUpdateStatus = async () => {
  //   if (selectedOrder && selectedOrder?._id && selectedStatus) {
  //     const result = await MySwal.fire({
  //       title: "Xác nhận cập nhật trạng thái?",
  //       text: `Bạn có chắc chắn muốn cập nhật trạng thái đơn hàng thành "${selectedStatus}" không?`,
  //       icon: "warning",
  //       showCancelButton: true,
  //       confirmButtonColor: "#3085d6",
  //       cancelButtonColor: "#d33",
  //       confirmButtonText: "Có",
  //       cancelButtonText: "Hủy",
  //     });

  //     if (result.isConfirmed) {
  //       try {
  //         const response = await dispatch(
  //           updateStatusByIdThunk({
  //             orderId: selectedOrder?._id as string,
  //             stateOrder: selectedStatus,
  //           })
  //         ).unwrap();
  //         await dispatch(getOrderDetailByIdThunk(selectedOrder?._id as string));
  //         toast.success(
  //           response.stateOrder
  //             ? `Trạng thái đơn hàng đã được cập nhật thành "${response.stateOrder}"!`
  //             : "Cập nhật thành công!"
  //         );
  //       } catch (error) {
  //         let errorMessage = "Đã xảy ra lỗi khi cập nhật trạng thái đơn hàng.";
  //         if (error instanceof Error) {
  //           errorMessage = error.message;
  //         }
  //         toast.error(errorMessage);
  //       }
  //     }
  //   }
  // };

  // const renderStatusButton = () => {
  //   switch (selectedOrder?.stateOrder) {
  //     case "Chờ xử lý":
  //       return (
  //         <>
  //           <Button
  //             onClick={() => {
  //               setSelectedStatus("Đã xác nhận");
  //               handleUpdateStatus();
  //             }}
  //             className="mt-4 bg-green-500 text-white"
  //           >
  //             Đã xác nhận
  //           </Button>
  //           <Button
  //             onClick={() => {
  //               setSelectedStatus("Hủy đơn hàng");
  //               handleUpdateStatus();
  //             }}
  //             className="mt-4 bg-red-500 text-white"
  //           >
  //             Hủy đơn hàng
  //           </Button>
  //         </>
  //       );
  //     case "Đã xác nhận":
  //       return (
  //         <Button
  //           onClick={() => {
  //             setSelectedStatus("Đang vận chuyển");
  //             handleUpdateStatus();
  //           }}
  //           className="mt-4 bg-yellow-500 text-white"
  //         >
  //           Đang vận chuyển
  //         </Button>
  //       );
  //     case "Đang vận chuyển":
  //       return (
  //         <>
  //           <Button
  //             onClick={() => {
  //               setSelectedStatus("Hoàn tất");
  //               handleUpdateStatus();
  //             }}
  //             className="mt-4 bg-blue-500 text-white"
  //           >
  //             Hoàn tất
  //           </Button>
  //           <Button
  //             onClick={() => {
  //               setSelectedStatus("Giao hàng không thành công");
  //               handleUpdateStatus();
  //             }}
  //             className="mt-4 bg-red-500 text-white"
  //           >
  //             Giao hàng không thành công
  //           </Button>
  //         </>
  //       );
  //     case "Giao hàng không thành công":
  //       return (
  //         <>
  //           <Button
  //             onClick={() => {
  //               setSelectedStatus("Trả hàng về cửa hàng");
  //               handleUpdateStatus();
  //             }}
  //             className="mt-4 bg-orange-500 text-white"
  //           >
  //             Trả hàng về cửa hàng
  //           </Button>
  //           {selectedOrder?.payment.payment_method !==
  //             "Thanh toán khi nhận hàng" && (
  //             <Button
  //               onClick={() => {
  //                 setSelectedStatus("Đã hoàn tiền");
  //                 handleUpdateStatus();
  //               }}
  //               className="mt-4 bg-purple-500 text-white"
  //             >
  //               Hoàn tiền
  //             </Button>
  //           )}
  //         </>
  //       );
  //     case "Hoàn tất":
  //       return <p className="mt-4 text-gray-500">Đơn hàng đã hoàn tất</p>;
  //     case "Hủy đơn hàng":
  //       return (
  //         <>
  //           {selectedOrder?.payment.payment_method !==
  //             "Thanh toán khi nhận hàng" && (
  //             <Button
  //               onClick={() => {
  //                 setSelectedStatus("Đã hoàn tiền");
  //                 handleUpdateStatus();
  //               }}
  //               className="mt-4 bg-purple-500 text-white"
  //             >
  //               Hoàn tiền
  //             </Button>
  //           )}
  //         </>
  //       );
  //     default:
  //       return null;
  //   }
  // };
  const handleUpdateStatus = async (newStatus: string) => {
    if (selectedOrder && selectedOrder?._id) {
      const result = await MySwal.fire({
        title: "Xác nhận cập nhật trạng thái?",
        text: `Bạn có chắc chắn muốn cập nhật trạng thái đơn hàng thành "${newStatus}" không?`,
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
              stateOrder: newStatus,
            })
          ).unwrap();
          await dispatch(getOrderDetailByIdThunk(selectedOrder?._id as string));
          toast.success(
            response.stateOrder
              ? `Trạng thái đơn hàng đã được cập nhật thành "${response.stateOrder}"!`
              : "Cập nhật thành công!"
          );
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
          <>
            <Button
              onClick={() => handleUpdateStatus("Đã xác nhận")}
              className="mt-4 bg-green-500 text-white"
            >
              Đã xác nhận
            </Button>
            <Button
              onClick={() => handleUpdateStatus("Hủy đơn hàng")}
              className="mt-4 bg-red-500 text-white"
            >
              Hủy đơn hàng
            </Button>
          </>
        );
      case "Đã xác nhận":
        return (
          <Button
            onClick={() => handleUpdateStatus("Đang vận chuyển")}
            className="mt-4 bg-yellow-500 text-white"
          >
            Đang vận chuyển
          </Button>
        );
      case "Đang vận chuyển":
        return (
          <>
            <Button
              onClick={() => handleUpdateStatus("Hoàn tất")}
              className="mt-4 bg-blue-500 text-white"
            >
              Hoàn tất
            </Button>
            <Button
              onClick={() => handleUpdateStatus("Giao hàng không thành công")}
              className="mt-4 bg-red-500 text-white"
            >
              Giao hàng không thành công
            </Button>
          </>
        );
      case "Giao hàng không thành công":
        return (
          <Button
            onClick={() => handleUpdateStatus("Trả hàng về cửa hàng")}
            className="mt-4 bg-orange-500 text-white"
          >
            Trả hàng về cửa hàng
          </Button>
        );
      case "Trả hàng về cửa hàng":
        return (
          <>
            {selectedOrder?.payment.payment_method === "vnPay" && (
              <Button
                onClick={() => handleUpdateStatus("Đã hoàn tiền")}
                className="mt-4 bg-purple-500 text-white"
              >
                Hoàn tiền
              </Button>
            )}
          </>
        );
      case "Hoàn tất":
        return <p className="mt-4 text-gray-500">Đơn hàng đã hoàn tất</p>;
      case "Hủy đơn hàng":
        return (
          <>
            {selectedOrder?.payment.payment_method !==
              "Thanh toán khi nhận hàng" && (
              <Button
                onClick={() => handleUpdateStatus("Đã hoàn tiền")}
                className="mt-4 bg-purple-500 text-white"
              >
                Hoàn tiền
              </Button>
            )}
          </>
        );
      default:
        return null;
    }
  };

  // const renderStatusButton = () => {
  //   switch (selectedOrder?.stateOrder) {
  //     case "Chờ xử lý":
  //       return (
  //         <>
  //           <Button
  //             onClick={() => handleUpdateStatus("Đã xác nhận")}
  //             className="mt-4 bg-green-500 text-white"
  //           >
  //             Đã xác nhận
  //           </Button>
  //           <Button
  //             onClick={() => handleUpdateStatus("Hủy đơn hàng")}
  //             className="mt-4 bg-red-500 text-white"
  //           >
  //             Hủy đơn hàng
  //           </Button>
  //         </>
  //       );
  //     case "Đã xác nhận":
  //       return (
  //         <Button
  //           onClick={() => handleUpdateStatus("Đang vận chuyển")}
  //           className="mt-4 bg-yellow-500 text-white"
  //         >
  //           Đang vận chuyển
  //         </Button>
  //       );
  //     case "Đang vận chuyển":
  //       return (
  //         <>
  //           <Button
  //             onClick={() => handleUpdateStatus("Hoàn tất")}
  //             className="mt-4 bg-blue-500 text-white"
  //           >
  //             Hoàn tất
  //           </Button>
  //           <Button
  //             onClick={() => handleUpdateStatus("Giao hàng không thành công")}
  //             className="mt-4 bg-red-500 text-white"
  //           >
  //             Giao hàng không thành công
  //           </Button>
  //         </>
  //       );
  //     case "Giao hàng không thành công":
  //       return (
  //         <>
  //           <Button
  //             onClick={() => handleUpdateStatus("Trả hàng về cửa hàng")}
  //             className="mt-4 bg-orange-500 text-white"
  //           >
  //             Trả hàng về cửa hàng
  //           </Button>
  //           {selectedOrder?.payment.payment_method !==
  //             "Thanh toán khi nhận hàng" && (
  //             <Button
  //               onClick={() => handleUpdateStatus("Đã hoàn tiền")}
  //               className="mt-4 bg-purple-500 text-white"
  //             >
  //               Hoàn tiền
  //             </Button>
  //           )}
  //         </>
  //       );
  //     case "Hoàn tất":
  //       return <p className="mt-4 text-gray-500">Đơn hàng đã hoàn tất</p>;
  //     case "Hủy đơn hàng":
  //       return (
  //         <>
  //           {selectedOrder?.payment.payment_method !==
  //             "Thanh toán khi nhận hàng" && (
  //             <Button
  //               onClick={() => handleUpdateStatus("Đã hoàn tiền")}
  //               className="mt-4 bg-purple-500 text-white"
  //             >
  //               Hoàn tiền
  //             </Button>
  //           )}
  //         </>
  //       );
  //     default:
  //       return null;
  //   }
  // };

  if (!order) {
    return (
      <main className="w-full flex-grow p-6">
        <p>Không tìm thấy đơn hàng.</p>
      </main>
    );
  }

  return (
    <main className="w-full flex-grow p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Thông Tin Đơn Hàng */}
        <section className="mb-8 bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Thông Tin Đơn Hàng
          </h2>
          <div className="space-y-2">
            <p className="text-lg mb-2 text-gray-700">
              <span className="font-medium">Mã đơn hàng:</span> #
              {selectedOrder?._id || "null"}
            </p>
            <p className="text-lg mb-2 text-gray-700">
              <span className="font-medium">Ngày đặt:</span>{" "}
              {new Date(
                selectedOrder?.createdAt || "null"
              ).toLocaleDateString()}
            </p>
            <p className="text-lg text-red-600 mb-2">
              <span className="font-medium">Tổng tiền:</span>{" "}
              {selectedOrder?.totalAmount?.toLocaleString() || "0"} VND
            </p>
            <div className="mb-4">
              <label className="text-lg font-medium mb-2 block">
                Trạng thái:
              </label>
              <p>{selectedOrder?.stateOrder}</p>
            </div>

            {renderStatusButton()}
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
        </section>

        {/* Thông Tin Khách Hàng */}
        <section className="mb-8 bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Thông Tin Khách Hàng
          </h2>
          <div className="space-y-2">
            <p className="text-lg mb-2 text-gray-700">
              <span className="font-medium">Họ tên:</span>{" "}
              {selectedOrder?.shipping?.recipientName || "N/A"}
            </p>
            <p className="text-lg mb-2 text-gray-700">
              <span className="font-medium">Số điện thoại:</span>{" "}
              {selectedOrder?.shipping?.phoneNumber || "N/A"}
            </p>
            <p className="text-lg text-gray-700">
              <span className="font-medium">Địa chỉ giao hàng:</span>{" "}
              {selectedOrder?.shipping?.address || "N/A"}
            </p>
          </div>
        </section>

        {/* Phương thức thanh toán */}
        <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Phương thức thanh toán
          </h3>
          <p>{selectedOrder?.payment?.payment_method}</p>
        </div>
        {/* Ngân Hàng Thanh Toán */}
        {/* {selectedOrder?.payment?.payment_method !==
          "Thanh toán khi nhận hàng" &&
          selectedOrder?.stateOrder === "Hủy đơn hàng" && (
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
          )} */}
        {selectedOrder?.payment?.payment_method !==
          "Thanh toán khi nhận hàng" &&
          (selectedOrder?.stateOrder === "Hủy đơn hàng" ||
            selectedOrder?.stateOrder === "Trả hàng về cửa hàng") && (
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

        {/* Sản Phẩm */}
        <section className="mb-8 bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Sản Phẩm</h2>
          <div className="space-y-4">
            {items?.length ? (
              items.map((item, index) => (
                <div
                  key={item?.product?._id || index}
                  className="flex justify-between items-center p-4 bg-gray-100 rounded-lg shadow-md transition-all duration-200 hover:bg-gray-200"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={
                        item?.productVariant?.image?.[0]?.image?.[0] ||
                        "https://via.placeholder.com/64"
                      }
                      alt={item?.productVariant?.variant_name || "No Image"}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div>
                      <h4 className="font-medium text-lg text-gray-800">
                        {item?.productVariant?.variant_name || "N/A"}
                      </h4>
                      <p className="text-gray-600">
                        Số lượng: {item?.quantity || 0}
                      </p>
                    </div>
                  </div>
                  <p className="text-lg text-gray-800">
                    {item?.productVariant?.variant_price
                      ? `${item.productVariant.variant_price.toLocaleString()} VND`
                      : "0 VND"}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-lg text-gray-600">
                Không có sản phẩm nào trong đơn hàng
              </p>
            )}
          </div>
        </section>

        {/* Nút Quay Lại */}
        <button
          onClick={handleBackToList}
          className="w-full bg-blue-600 text-white py-3 rounded-md shadow-lg hover:bg-blue-700 transition duration-300"
        >
          Quay lại danh sách đơn hàng
        </button>
      </div>

      <ToastContainer />
    </main>
  );
};

export default OrderDetails;
