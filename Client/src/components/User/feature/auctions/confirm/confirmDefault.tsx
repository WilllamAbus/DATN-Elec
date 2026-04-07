import { Button } from "flowbite-react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrderAuctionDetailsDefault, completOrder } from "../../../../../redux/confirmOrder/confirmOrderThunk";

import { RootState, AppDispatch } from "../../../../../redux/store";
// import { Product, ShippingInfo } from "../../../../../types/auctions/confirmOrder";
import { useNavigate } from "react-router-dom";
const ConfirmOrderPageDefault: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const orderIds = useSelector(
    (state: RootState) => state.orderAuction.orderData?.orderAuctionID
  );

  
  const confirmOrderDefault = useSelector(
    (state: RootState) => state.confirmOrder.confirmOrderDefaut
  );
  // const [, setOrderId] = useState<string | null>(null);
  // const location = useLocation();
  const loading = useSelector((state: RootState) => state.confirmOrder.loading);
  const error = useSelector((state: RootState) => state.confirmOrder.error);
  const navigate = useNavigate();



  useEffect(() => {
    if (orderIds) {
      // Ensure dispatch is used properly
      dispatch(getOrderAuctionDetailsDefault({orderIds}));
    }
  }, [orderIds, dispatch]);



  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  const handleCompleteOrder = () => {
    if (orderIds) {
      dispatch(completOrder(orderIds)).then(() => {
        // Navigate after completing the order
        navigate("/auction");
      });
    }
  };


  const shippingInfo = confirmOrderDefault?.shippingInfo;
  const products = confirmOrderDefault?.products;

  return (
    <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
      <div className="mx-auto max-w-2xl px-4 2xl:px-0">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl mb-2">
          Cảm ơn quý khách!
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6 md:mb-8">
          Thanh toán của bạn{" "}
          <a
            href="#"
            className="font-medium text-gray-900 dark:text-white hover:underline"
          >
            #{orderIds}
          </a>{" "}
          sẽ được xử lý trong vòng 24 giờ trong ngày làm việc. Chúng tôi sẽ
          thông báo cho bạn qua email khi đơn hàng của bạn đã được chuyển đi.
        </p>
        <div className="space-y-4 sm:space-y-2 rounded-lg border border-gray-100 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800 mb-6 md:mb-8">
          {shippingInfo && (
            <>
              <dl className="sm:flex items-center justify-between gap-4">
                <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">
                  Tên người nhận
                </dt>
                <dd className="font-medium text-gray-900 dark:text-white sm:text-end">
                  {shippingInfo.recipientName}
                </dd>
              </dl>
              <dl className="sm:flex items-center justify-between gap-4">
                <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">
                  Địa chỉ
                </dt>
                <dd className="font-medium text-gray-900 dark:text-white sm:text-end">
                  {shippingInfo.address}
                </dd>
              </dl>
              <dl className="sm:flex items-center justify-between gap-4">
                <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">
                  Số điện thoại
                </dt>
                <dd className="font-medium text-gray-900 dark:text-white sm:text-end">
                  {shippingInfo.phoneNumber}
                </dd>
              </dl>
            </>
          )}
        </div>
        <div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Sản phẩm:
            </h3>
            {products?.map((product, index) => (
              <div
                key={index}
                className="mt-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
              >
                <h4 className="text-md font-medium text-gray-900 dark:text-white">
                  {product.name}
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                
                Giá: {(product.price + 31000).toLocaleString()} VND
                </p>
                {product.image.length > 0 && (
                  <img
                    src={product.image[0]}
                    alt={product.name}
                    className="mt-2 w-full h-auto object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-4 mt-8">
          <Button
            onClick={handleCompleteOrder}
            className="text-white
           bg-blue-800 hover:bg-primary-800 
           focus:ring-4 focus:ring-primary-300 font-medium 
           rounded-lg text-sm px-5 py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700
               focus:outline-none dark:focus:ring-primary-800"
          >
            Hoàn tất đơn hàng
          </Button>

     
        </div>
      </div>
    </section>
  );
};

export default ConfirmOrderPageDefault;
