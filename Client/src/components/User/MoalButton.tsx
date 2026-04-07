import React, { useState , useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { createBidThunk } from "../../redux/bidding/biddingThunk";
import { fetchRandBid } from "../../redux/timeTrackProduct/getRandBidV2/getRandBidThunk";
import currencyFormatter from "currency-formatter";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { NumericFormat } from "react-number-format";
import socketService from "../../services/socket/socketService";
import UserAuctDetails from '../User/feature/details/auctions/auctionsDetail'
const Modal: React.FC<{ productId: string }> = ({ productId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [bidAmount, setBidAmount] = useState<number | undefined>(undefined);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const userId = useSelector((state: RootState) => state.auth.profile.profile?._id);
  const { bid } = useSelector((state: RootState) => state.randBidPrice);
  const bidStatus = useSelector((state: RootState) => state.bidding.status);
  // const isLoggedIn = useSelector(
  //   (state: RootState) => state.auth.login.isLoggedIn
  // );
  const userRole = useSelector(
    (state: RootState) => state.auth.profile?.roles || []
  );

  
  const error = useSelector((state: RootState) => state.auth.login.error);
  // const roles = useSelector((state: RootState) => state.auth.login.roles);
  useEffect(() => {
    if (userRole && userRole.length > 0) {
      const isUeer = userRole.includes("admin") ;
 

      
      if (isUeer) {
        toast.success("Bạn là Admin - Tài khoản không được tiến hành đấu giá !!");
        setTimeout(() => {
           <UserAuctDetails productId={productId} />
        }, 2000);
      } 
    } else {
  
      <UserAuctDetails productId={productId} />
    }
  }, [ userRole, error, navigate]);
  const toggleModal = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      dispatch(fetchRandBid(productId));
    }
  };

  const closeModal = () => setIsOpen(false);

  const handleBidClick = (amount: number | undefined) => {
    if (amount !== undefined) {
      setBidAmount(amount);
      handleSubmit(amount);
    } else {
      toast.error("Lỗi xác nhận giá thầu. Làm ơn thử lại");
    }
  };

  const handleBidAmountChange = (values: any) => setBidAmount(values.floatValue);

  const handleSubmit = (amount?: number) => {
  
    
    if (!userId) {
      toast.error("Bạn chưa đăng nhập");
      return;
    }
    const finalBidAmount = amount ?? bidAmount;
    if (finalBidAmount === undefined) {
      toast.error("Giá thầu là bắt buộc");
      return;
    }
 
    const minBid = bid?.minBid ?? 0;
    // const maxBid = bid?.maxBid ?? 0;
    const maxAllowedBid = minBid * 1.07; // 7% more than minBid

    const isValidBid = finalBidAmount >= minBid && finalBidAmount <= maxAllowedBid 
    
    if (isValidBid && userId ) {
     
      dispatch(createBidThunk({ productId, userId, bidAmount: finalBidAmount }))
        .then(() => {
          socketService.emitCreateBidding(productId, { userId, bidAmount: finalBidAmount });
          toast.success("Đặt thầu thành công!", {
            onClose: () => {
              navigate("/viewBids"); // Điều hướng sau khi toast hiển thị xong
            },
          });
     
        })
        .catch((error) => {
          toast.error(`Error: ${error.message}`);
        });
    } else {
      toast.error(`Giá thầu phải lớn hơn hoặc bằng ${currencyFormatter.format(minBid, { code: "VND", symbol: "" })}
        và không vượt quá ${currencyFormatter.format(maxAllowedBid, { code: "VND", symbol: "" })}.`);

    }
  };

  return (
    <>
      <button
        id="open-modal"
        style={{ width: 250 }}
        className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
        type="button"
        onClick={toggleModal}
      >
        Đặt giá thầu
      </button>

      {isOpen && (
        <div
          id="default-modal"
          tabIndex={-1}
          aria-hidden="true"
          className="fixed inset-0 flex items-center justify-center z-50 bg-transparent bg-opacity-10"
        >
          <div className="relative w-90 p-4 bg-white rounded-lg shadow dark:bg-gray-700">
            <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Đặt thầu</h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={closeModal}
              >
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                </svg>
                <span className="sr-only">Đóng</span>
              </button>
            </div>
            <div className="relative p-5 text-center bg-white rounded-lg shadow dark:bg-gray-800 max-w-3xl mx-auto">
            <div className="flex justify-center items-center space-x-8">
  {[
    { label: "Giá thấp (đ) ", value: bid?.minBid,  },
    { label: "Giá trung bình (đ)", value: bid?.midBid },
    { label: "Giá cao (đ) ", value: (bid?.minBid ?? 0) * 1.07 },
  ].map((item, index) => (
    <div key={index} className="flex flex-col items-center w-1/3">
      <label className="text-sm text-gray-500 dark:text-gray-300 mb-1">{item.label}</label>
      <span
    
        className="w-full py-3 px-6 text-sm font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-900"
        onClick={() => handleBidClick(item.value)}
      >
        {currencyFormatter.format(item.value ?? 0, { code: "VND", symbol: "" })} 
      </span>
    </div>
  ))}
</div>

              <br />
              <hr className="mb-4 border-gray-300 dark:border-gray-600" />
              <br />
              <div className="flex justify-center items-center space-x-4 mb-4 w-full">
                <NumericFormat
                  placeholder="Nhập thầu"
                  value={bidAmount}
                  onValueChange={handleBidAmountChange}
                  thousandSeparator=","
                  allowNegative={false}
                  className="w-2/3 py-3 px-6 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:focus:ring-gray-600"
                />
                <button
                  type="button"
                  className="w-1/3 py-3 px-6 text-sm font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-900"
                  onClick={() => handleSubmit()}
                >
                  Đặt thầu
                </button>
              </div>
              {bidStatus === 'loading' && <p>Loading...</p>}
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </>
  );
};

export default Modal;
