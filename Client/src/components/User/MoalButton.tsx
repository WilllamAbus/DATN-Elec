import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { fetchVouchers } from '../../redux/discount/voucherThunk';
import { Voucher } from '../../types/Voucher.d'; // Ensure this path is correct

interface ModalProps {
  onVoucherApply: (voucher: Voucher) => void;
}

const formatPrices = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price) + ' vnđ';
};

const Modal: React.FC<ModalProps> = ({ onVoucherApply }) => {
  const [isOpen, setIsOpen] = useState(false);

  const dispatch: AppDispatch = useDispatch();
  const { vouchers, loading, error } = useSelector((state: RootState) => state.voucher);
  
  useEffect(() => {
    dispatch(fetchVouchers());
  }, [dispatch]);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const closeModal = () => {
    setIsOpen(false);
  };



  const handleApplyVoucher = async (voucher: Voucher) => {
   try {
    onVoucherApply(voucher);
    // await dispatch(softDeleteVoucherThunk(voucher._id)).unwrap();
  
    closeModal();
   } catch (error) {
    console.error("Error deleting Voucher:", error);
   }
  
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <>
      <button
        id="open-modal"
        className="block text-white w-full bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
        type="button"
        onClick={toggleModal}
      >
        Mã giảm giá
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
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Vouchers
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={closeModal}
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Đóng</span>
              </button>
            </div>
            <div className="p-4 space-y-4">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MÃ GIẢM</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GIÁ GIẢM</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HÀNH ĐỘNG</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-600">
                  {vouchers.map((voucher) => (
                    <tr key={voucher._id} className="hover:bg-gray-100 dark:hover:bg-gray-600">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{voucher.code}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{formatPrices(voucher.voucherNum)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <button
                          type="button"
                          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1"
                          onClick={() => handleApplyVoucher(voucher)}
                        >
                          Áp dụng
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center p-4 border-t border-gray-200 rounded-b dark:border-gray-600">
              <button
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
                onClick={closeModal}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
