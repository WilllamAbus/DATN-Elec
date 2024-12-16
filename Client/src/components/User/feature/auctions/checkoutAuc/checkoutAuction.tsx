import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../../../redux/store';
import { fetchAuction } from '../../../../../redux/aucCheckout/auctCheckoutThunk';
import { createOrderThunk } from '../../../../../redux/orderAuction/orderAuctionThunk';
import { Button, Card, Label, Select } from 'flowbite-react';
import { ToastContainer, toast } from 'react-toastify';
import { Controller, useForm } from 'react-hook-form';
import { AuctionData, FormData, OrderDataType , OrderResponse} from '../../../../../types/auctions/auctCheckout';
// import { AuctionDataComplete} from '../../../../../types/auctions/auctions';
import { SanboxPayment } from '../../../../../services/pay/sanboxPayment';
import { calculateSignature } from '../../../../../services/pay/signature';
import { useNavigate } from 'react-router-dom';
// import { Bid } from "../../../../types/bidding/bidding";
// Create an instance of SanboxPayment
const signatureService = { calculateSignature };
const paymentService = new SanboxPayment(signatureService);

const CheckoutPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => state.auth.profile.profile?._id);


  const userNameProfile = useSelector((state: RootState) => state.auth.profile.profile?.name);


  
  const productId = useSelector((state: RootState) => state.bidding.bidData?.data.product_bidding.productId); 


  

  const auctionData = useSelector((state: RootState) => state.auctCheckout.auctionData) as AuctionData | null;

  const address = useSelector((state: RootState) => state.auth.profile);
  const defaultAddress = address?.profile?.addresses.find(
    (address) => address.isDefault === true
  );
  // const productIds = useSelector((state: RootState) => state.bidding.bidData?.data.product_bidding.productId); 

  
  // const aucttionDataProduct = useSelector((state: RootState) => state.auction.auction?.productId);


  
     // Access order data from `orderAuction`
  const loading = useSelector((state: RootState) => state.orderAuction.loading); // Use loading from `orderAuction`
  const navigate = useNavigate(); // Create navigate instance

  const { control, handleSubmit } = useForm<FormData>();
  const [amount, setAmount] = useState<number>(0);

  useEffect(() => {
    if (userId && productId) {
      dispatch(fetchAuction({userId, productId}));
    }
  }, [dispatch, userId, productId]);

  useEffect(() => {
    if (auctionData) {
      // Calculate the amount including auctionTotal and shipping (assuming shipping is fixed)
      const shipping = 31000; // Fixed shipping cost
      const totalAmount = (auctionData.auctionTotal || 0) + shipping;
      setAmount(totalAmount);
    }
  }, [auctionData]);
const auctionDetails= auctionData?.auctionId
// const auctionNamePay = defaultAddress?.fullName
const auctionNamePays = auctionData?.userName


const onSubmit = async (data: FormData) => {

  // Check for missing form fields
  if (!auctionDetails || !userId || !data.payment) {
    toast.error('Vui lòng điền đầy đủ thông tin và chọn phương thức thanh toán');
    return;
  }

  // Ensure address is provided
 

  const orderData: OrderDataType = {
    userId,
    auctionDetails,
    payment: data.payment,
  };

  try {
    // Create order with details
    const response: OrderResponse = await dispatch(createOrderThunk(orderData)).unwrap();
 

    if (data.payment === 'MoMo') {
      // Process MoMo payment
      if(auctionNamePays === userNameProfile){
        await paymentService.processMoMoPaymentWithRetry(amount, auctionData.auctionId);
        toast.success('Thanh toán thành công');
      }else {
        navigate('/auction');
        toast.success('Bạn không thanh toán được cho sản phẩm này');
      }
   
  

    } else if (data.payment === 'Cash') {
      if(response.data){
    
        if(auctionNamePays === userNameProfile){
          toast.success('Thanh toán khi nhận hàng');
          navigate('/confimAucDefault');
        }else {
          navigate('/auction');
          toast.success('Bạn không thanh toán được cho sản phẩm này');
        }
   
      }
      // Handle Cash payment
       // Redirect after successful payment

    } else if (data.payment === 'VnPay') {
      // Handle VNPay payment
      if (response.data && response.data.hashLinkPayment) {
        if(auctionNamePays === userNameProfile){
          toast.success('Thanh toán thành công');
          window.location.href = response.data.hashLinkPayment;
        }else {
          navigate('/auction');
          toast.success('Bạn không thanh toán được cho sản phẩm này');
        }
        // Redirect user to VNPay payment page
    
      } else {
        throw new Error('VNPay payment URL is missing in the response');
      }

    } else {
      throw new Error('Phương thức thanh toán không hợp lệ');
    }

  } catch (error) {
    console.error('Error processing order:', error);
    toast.error('Đã xảy ra lỗi trong quá trình xử lý đơn hàng');
  }
};


  const shippingFee = 31000;

  // Calculate the total price including shipping
  const totalPriceWithShipping = auctionData && auctionData.auctionTotal !== undefined
    ? auctionData.auctionTotal + shippingFee
    : shippingFee;


  return (
    <>
      <div className="container py-4 flex items-center gap-3">
        <a href="/" className="text-primary text-base">
          <i className="fa-solid fa-house"></i>
        </a>
        <span className="text-sm text-gray-400">
          <i className="fa-solid fa-chevron-right"></i>
        </span>
        <p className="text-gray-600 font-medium">Checkout</p>
      </div>

      <div className="container grid grid-cols-12 items-start pb-16 pt-4 gap-6">
        <div className="col-span-8 border border-gray-200 p-4 rounded-lg">
          <h3 className="text-lg font-medium capitalize mb-4">Checkout</h3>
          <div className="space-y-4">
            <form onSubmit={handleSubmit(onSubmit)}>
          
              <div>
                <Label htmlFor="name" value="Tên người nhận" />
                <input
                  type="text"
                  id="name"
                  value={defaultAddress?.fullName || ''}
                  readOnly
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <br />
              <div>
                <Label htmlFor="address" value="Địa chỉ" />
                <input
                  type="text"
                  id="address"
                  value={defaultAddress?.address || ''}
                  readOnly
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <br />
              <div>
                <Label htmlFor="phone" value="SĐT" />
                <input
                  type="text"
                  id="phone"
                  value={defaultAddress?.phone || ''}
                  readOnly
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <br />
              <div>
                <Label htmlFor="payment" value="Phương thức thanh toán" />
                <Controller
                  name="payment"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Select id="payment" {...field}>
                      <option value="" disabled>
                        Chọn phương thức thanh toán
                      </option>
                      <option value="Cash">Thanh toán khi nhận hàng</option>
                      <option value="MoMo">MoMo</option>
                      <option value="VnPay">VnPay</option>
                    </Select>
                  )}
                />
              </div>
              <br />
              <Button type="submit" className="w-full bg-blue-700 text-white">
                Thanh toán
              </Button>
            </form>
          </div>
        </div>

        <div className="col-span-4">
          <Card>
            <h3 className="text-lg font-medium mb-4">Mua sắm đấu giá</h3>
            {loading ? (
              <p>Đang tải dữ liệu đơn hàng...</p>
            ) : (
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                {auctionData?.productImages && auctionData.productImages.length > 0 ? (
                  <img
                    src={auctionData.productImages[0]} // Show only the first image
                    alt={auctionData.productName || 'No product name'}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                ) : (
                  <p>No image available</p>
                )}
                <span>{auctionData?.productName || 'No product name'}</span>
                <span>{auctionData?.auctionQuantity || '0'}</span>
              </div>
            )}
            <div className="flex items-center justify-between py-2 font-bold">
            <span>Vận chuyển:</span>
             
             <span>
                31,000 đ
             </span>
              <span>Tổng cộng:</span>
             
              <span>
              {totalPriceWithShipping.toLocaleString()} đ
               
              </span>
            </div>
            {/* {orderData && (
              <div className="mt-4">
                <h4 className="text-md font-medium">Thông tin đơn hàng:</h4>
                <p>ID Đơn Hàng: {orderData.orderAuctionID}</p>
                <p>ID Chi Tiết Đơn Hàng: {orderData.orderDetailAuctionID}</p>
              </div>
            )} */}
          </Card>
        </div>
      </div>

      <ToastContainer />
    </>
  );
};

export default CheckoutPage;
