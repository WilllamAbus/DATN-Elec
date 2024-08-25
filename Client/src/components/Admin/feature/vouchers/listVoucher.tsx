// DiscountList.tsx
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../../../redux/store";
import { fetchVouchers, softDeleteVoucherThunk } from "../../../../redux/discount/voucherThunk";
import { Link } from "react-router-dom";
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
const DiscountList: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { vouchers, loading, error } = useSelector((state: RootState) => state.voucher);
  const [, setVoucher] = useState<Voucher[]>(vouchers);

  useEffect(() => {
    dispatch(fetchVouchers());
  }, [dispatch]);

  const handleSoftDelete = async (id: string) => {
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
          await dispatch(softDeleteVoucherThunk(id)).unwrap();
          dispatch(fetchVouchers());
          setVoucher(
            (prevVoucher) => prevVoucher.filter((vouchers) => vouchers._id !== id) // Use `voucher._id` instead of `_id`
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

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="p-4">
            <div className="flex items-center">
              <input
                id="checkbox-all"
                type="checkbox"
                className="w-4 h-4 text-primary-600 bg-gray-100 rounded border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="checkbox-all" className="sr-only">
                checkbox
              </label>
            </div>
          </th>
          <th scope="col" className="p-4">
            MÃ GIẢM
          </th>
          <th scope="col" className="p-4">
            GIẢM GIÁ
          </th>
          <th scope="col" className="p-4">
            HẠN SỬ DỤNG
          </th>
          <th scope="col" className="p-4">
            DANH MỤC SẴN SÀNG
          </th>
          <th scope="col" className="p-4">
            MÔ TẢ
          </th>
          <th scope="col" className="p-4">
            TRẠNG THÁI
          </th>
          <th scope="col" className="p-4">
            HÀNH ĐỘNG
          </th>
        </tr>
      </thead>
      <tbody>
        {vouchers.map((voucher) => (
          <tr
            key={voucher._id}
            className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <td className="p-4 w-4">
              <div className="flex items-center">
                <input
                  id="checkbox-table-search-1"
                  type="checkbox"
                  className="w-4 h-4 text-primary-600 bg-gray-100 rounded border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label htmlFor="checkbox-table-search-1" className="sr-only">
                  checkbox
                </label>
              </div>
            </td>
            <td className="px-4 py-3">
              <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300">
                {voucher.code}
              </span>
            </td>
            <td className="px-4 py-3">{formatPrices(voucher.voucherNum)}</td>
            <td className="px-4 py-3">{voucher.expiryDate}</td>
            <td className="px-4 py-3">
              {voucher.cateReady.map((category, index) => (
                <div key={index}>{category.name}</div>
              ))}
            </td>
            <td className="px-4 py-3">{voucher.conditionActive}</td>
            <td className="px-4 py-3">
              <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-current">
                {voucher.status === "active" ? "Hiển thị" : "Đã ẩn"}
              </span>
            </td>
            <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              <div className="flex items-center space-x-4">
                <button
                  className="flex items-center text-red-700 bg-red-200 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-2 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                  onClick={() => handleSoftDelete(voucher._id)}
                >
                  Xoá
                </button>
                <Link
                  to={`/admin/editVouchers/${voucher._id}`}
                   className="py-2 px-3 flex items-center text-sm font-medium text-center text-white bg-lime-600 rounded-lg hover:bg-lime-500 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Sửa
                </Link>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DiscountList;
