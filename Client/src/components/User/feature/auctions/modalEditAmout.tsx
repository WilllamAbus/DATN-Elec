import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../redux/store";
import { updateBidAmountThunk } from "../../../../redux/bidding/biddingThunk";
import { fetchRandBid } from "../../../../redux/timeTrackProduct/randBidPrice/randBidPriceThunk";
import currencyFormatter from "currency-formatter";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NumericFormat } from "react-number-format";
import socketService from "../../../../services/socket/socketService";
import { fetchBidsByUserThunk } from '../../../../redux/bidding/biddingThunk';
import { Bid } from '../../../../types/bidding/bidding';

interface EditModalProps {
  productId: string;
  bid: Bid; // Ensure Bid type has required properties
  onClose: () => void;
}

const EditModal: React.FC<EditModalProps> = ({ productId, bid, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [bidAmount, setBidAmount] = useState<number | undefined>(undefined);
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => state.auth.profile.profile?._id);
  const randBidState = useSelector((state: RootState) => state.randBid);

  // Get bid from state or use prop
  const currentBid = randBidState[productId] || bid; // Use currentBid to avoid naming conflict

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchRandBid(productId));
    }
  }, [isOpen, productId, dispatch]);

  const toggleModal = () => setIsOpen(!isOpen);

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
    const finalBidAmount = amount ?? bidAmount;

    if (!userId) {
      toast.error("Bạn chưa có tài khoản. Hãy đăng nhập !!! để chỉnh sửa giá thầu");
      return;
    }

    if (finalBidAmount === undefined) {
      toast.error("Giá thầu là bắt buộc");
      return;
    }

    const minBid = currentBid.minBid; // Use currentBid to avoid naming conflict
    const maxBid = minBid * 1.07; // 7% above minBid
    const validBids = [minBid, minBid * 1.03, minBid * 1.07]; // Backend-specific valid bids
    const isValidBid = finalBidAmount >= minBid &&
      finalBidAmount <= maxBid && validBids.includes(finalBidAmount);

    if (isValidBid && userId) {
      dispatch(updateBidAmountThunk({ productId, userId, bidAmount: finalBidAmount }))
        .then(() => {
          socketService.emitUpdateBidding(productId, { userId, bidAmount: finalBidAmount });
          toast.success("Cập nhật giá thầu thành công!");

          dispatch(fetchBidsByUserThunk(userId));
          onClose(); // Use the onClose prop to close the modal
        })
        .catch((error) => {
          toast.error(`Error: ${error.message}`);
        });
    } else {
      toast.error(`Giá thầu phải lớn hơn hoặc bằng: ${validBids.map(bid => currencyFormatter.format(bid, { code: "VND", symbol: "" })).join(', ')}  và không vượt quá ${currencyFormatter.format(maxBid, { code: "VND", symbol: "" })}.`);
    }
  };

  return (
    <>
      <button
        id="open-modal"
        style={{ width: 150 }}
        className="block text-white bg-gray-700 hover:bg-blue-800 
        focus:ring-4 focus:outline-none focus:ring-blue-300 
        font-medium rounded-lg text-sm px-5 py-2.5"
        type="button"
        onClick={toggleModal}
      >
        Đặt lại thầu
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
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Đặt lại giá</h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={onClose}
              >
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                </svg>
                <span className="sr-only">Close</span>
              </button>
            </div>
            <div className="relative p-5 text-center bg-white rounded-lg shadow dark:bg-gray-800 max-w-3xl mx-auto">
              <div className="flex justify-center items-center space-x-8">
                {[
                  { label: "Giá thấp (VND)", value: currentBid.minBid },
                  { label: "Giá trung bình (VND)", value: currentBid.midBid },
                  { label: "Giá cao (VND)", value: currentBid.minBid * 1.07 },
                ].map((item, index) => (
                  <div key={index} className="flex flex-col items-center w-1/3">
                    <label className="text-sm text-gray-500 dark:text-gray-300 mb-1">{item.label}</label>
                    <button
                      type="button"
                      className="w-full py-3 px-6 text-sm font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-900"
                      onClick={() => handleBidClick(item.value)}
                    >
                      {currencyFormatter.format(item.value ?? 0, { code: "VND", symbol: "" })}
                    </button>
                  </div>
                ))}
              </div>
              <br />
              <hr className="mb-4 border-gray-300 dark:border-gray-600" />
              <br />
              <div className="flex flex-col items-center">
                <label htmlFor="bidAmount" className="text-sm text-gray-500 dark:text-gray-300 mb-2">
                  Giá thầu
                </label>
                <NumericFormat
                  id="bidAmount"
                  className="w-full py-3 px-6 text-sm font-medium text-center text-gray-900 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={bidAmount}
                  onValueChange={handleBidAmountChange}
                  thousandSeparator=","
                  allowNegative={false}
                  decimalScale={0}
                />
              </div>
              <br />
              <div className="flex justify-center items-center space-x-8 mt-4">
                <button
                  type="button"
                  className="py-2 px-4 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-900"
                  onClick={() => handleSubmit()}
                >
                  Cập nhật
                </button>
                <button
                  type="button"
                  className="py-2 px-4 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 dark:bg-gray-500 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
                  onClick={onClose}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditModal;
