// DiscountList.tsx
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../../../redux/store"; // Import your RootState type
import {
  fetchDeletedVoucherThunk,
  deleteVoucher,
  restoreVoucherThunk,
} from "../../../../redux/discount/voucherThunk"; // Import the thunk actions
// Import your custom Alert component

import Swal, { SweetAlertResult } from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Voucher } from "../../../../types/Voucher.d";
const MySwal = withReactContent(Swal);
const formatPrices = (price: number): string => {
  return (
    new Intl.NumberFormat("vi-VN", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price) + " vnđ"
  );
};
const DiscountListRestore: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();

  const { deletedVoucher } = useSelector((state: RootState) => state.voucher);

  // const status = useSelector((state: RootState) => state.voucher.status);
  // const error = useSelector((state: RootState) => state.voucher.error);
  const [, setVoucher] = useState<Voucher[]>(deletedVoucher);
  useEffect(() => {
    dispatch(fetchDeletedVoucherThunk());
  }, [dispatch]);

  const handleRestore = async (id: string) => {
    MySwal.fire({
      title: "Khôi phục mã giảm giá?",
      text: "Bạn có chắc muốn khôi phục dòng này không!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Có",
      cancelButtonText: "Hủy",
    }).then(async (result: SweetAlertResult) => {
      if (result.isConfirmed) {
        try {
          await dispatch(restoreVoucherThunk(id)).unwrap();
          dispatch(fetchDeletedVoucherThunk());
          setVoucher((prevVoucher) =>
            prevVoucher.filter((voucher) => voucher._id !== id)
          );

          MySwal.fire({
            title: "Đã khôi phục!",
            text: "Mã giảm giá  đã  khôi phục.",
            icon: "success",
          });
        } catch (error) {
          console.error("Error deleting product:", error);
          MySwal.fire({
            title: "Lỗi!",
            text: "Đã xảy ra sự cố ",
            icon: "error",
          });
        }
      }
    });
  };

  const handleDelete = async (id: string) => {
    MySwal.fire({
      title: "Xóa mã giảm giá?",
      text: "Bạn có chắc muốn xóa dòng này không!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Có",
      cancelButtonText: "Hủy",
    }).then(async (result: SweetAlertResult) => {
      if (result.isConfirmed) {
        try {
          await dispatch(deleteVoucher(id)).unwrap();
          dispatch(fetchDeletedVoucherThunk());
          setVoucher((prevVoucher) =>
            prevVoucher.filter((voucher) => voucher._id !== id)
          );
          MySwal.fire({
            title: "Đã xóa!",
            text: "Mã giảm giá  đã  xóa.",
            icon: "success",
          });
        } catch (error) {
          console.error("Error deleting product:", error);
          MySwal.fire({
            title: "Lỗi!",
            text: "Đã xảy ra sự cố ",
            icon: "error",
          });
        }
      }
    });
  };

  return (
    <table className="text-left w-full border-collapse">
      <thead>
        <tr>
          <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
            MÃ GIẢM
          </th>
          <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
            GIẢM GIÁ
          </th>
          <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
            HẠN SỬ DỤNG
          </th>
          <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
            DANH MỤC SẴN SÀNG
          </th>
          <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
            MÔ TẢ
          </th>
          <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
            TRẠNG THÁI
          </th>
          <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
            HÀNH ĐỘNG
          </th>
        </tr>
      </thead>
      <tbody>
        {deletedVoucher.map((voucher) => (
          <tr key={voucher._id} className="hover:bg-grey-lighter">
            <td className="py-4 px-6 border-b border-grey-light">
              {voucher.code}
            </td>
            <td className="py-4 px-6 border-b border-grey-light">
              {formatPrices(voucher.voucherNum)}
            </td>
            <td className="py-4 px-6 border-b border-grey-light">
              {voucher.expiryDate}
            </td>
            <td className="py-4 px-6 border-b border-grey-light">
              {voucher.cateReady?.map((category, index) => (
                <div key={index}>{category.name}</div>
              ))}
            </td>
            <td className="py-4 px-6 border-b border-grey-light">
              {voucher.conditionActive}
            </td>
            <td className="py-4 px-6 border-b border-grey-light">
              <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-current">
                {voucher.status === "active" ? "Hiển thị" : "Đã ẩn"}
              </span>
            </td>
            <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              <div className="flex items-center space-x-4">
                <button
                  className="flex items-center text-red-700 bg-red-200
                     hover:text-white border border-red-700
                      hover:bg-red-800 focus:ring-4 focus:outline-none
                       focus:ring-red-300 font-medium rounded-lg 
                       text-sm px-3 py-2 text-center
                        dark:border-red-500 dark:text-red-500
                         dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                  onClick={() => handleDelete(voucher._id)}
                >
                  Xoá
                </button>
                <button
                  className="py-2 px-3 flex items-center text-sm font-medium text-center text-white
                     bg-lime-600 rounded-lg hover:bg-lime-500 focus:ring-4 
                     focus:outline-none focus:ring-primary-300
                      dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  onClick={() => handleRestore(voucher._id)}
                >
                  Khôi phục
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DiscountListRestore;
