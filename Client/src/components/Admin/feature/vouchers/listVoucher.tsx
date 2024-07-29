// DiscountList.tsx
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../../redux/store'; // Import your RootState type
import { fetchVouchers, deleteVoucher } from '../../../../redux/discount/voucherThunk'; // Import the thunk actions
import AlertCustomStyles from '../../../../ultils/alert.succes'; // Import your custom Alert component
import { Link } from 'react-router-dom';
const formatPrices = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price) + ' vnđ';
};
const DiscountList: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const { vouchers, loading, error } = useSelector((state: RootState) => state.voucher);
    const [alert, setAlert] = useState<{ message: string; type: "success" | "error" | null }>({ message: '', type: null });
  
    useEffect(() => {
      dispatch(fetchVouchers());
    }, [dispatch]);
  
    const handleDelete = async (id: string) => {
      if (window.confirm('Are you sure you want to delete this discount?')) {
        try {
          await dispatch(deleteVoucher(id)).unwrap();
          setAlert({ message: 'Mã giảm giá xóa thành công!', type: 'success' });
        } catch (err) {
          setAlert({ message: 'Failed to delete discount.', type: 'error' });
        }
      }
    };
  
    if (loading) {
      return <p>Loading...</p>;
    }
  
    if (error) {
      return <p>Error: {error}</p>;
    }

  return (
    <main className="w-full flex-grow p-6">
   
      <div className="w-full mt-12">
        <p className="text-xl pb-3 flex items-center">
          <i className="fas fa-list mr-3"></i> DANH SÁCH ĐƠN HÀNG
        </p>
        {alert.type && <AlertCustomStyles message={alert.message} type={alert.type} />}
        <div className="bg-white overflow-auto">
          <table className="text-left w-full border-collapse">
            <thead>
              <tr>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">MÃ GIẢM</th>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">GIẢM GIÁ</th>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">HẠN SỬ DỤNG</th>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">DANH MỤC SẴN SÀNG</th>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">MÔ TẢ</th>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">HÀNH ĐỘNG</th>
              </tr>
            </thead>
            <tbody>
              {vouchers.map((voucher) => (
                <tr key={voucher._id} className="hover:bg-grey-lighter">
                  <td className="py-4 px-6 border-b border-grey-light">{voucher.code}</td>
                  <td className="py-4 px-6 border-b border-grey-light">{formatPrices(voucher.voucherNum)}</td> 
                  <td className="py-4 px-6 border-b border-grey-light">{voucher.expiryDate}</td> 
                  <td className="py-4 px-6 border-b border-grey-light">
                    {voucher.cateReady.map((category, index) => (
                      <div key={index}>{category.name}</div>
                    ))}
                  </td>
                  <td className="py-4 px-6 border-b border-grey-light">{voucher.conditionActive}</td> 
                  <td className="py-4 px-6 border-b border-grey-light">
                    <button
                      className="cta-btn btn text-red-500"
                      onClick={() => handleDelete(voucher._id)}
                    >
                      Xoá
                    </button>
                    <Link to={`/admin/editVouchers/${voucher._id}`}
                    className="cta-btn btn text-green-500 ml-4">
                      Sửa
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 flex gap-2">
        <button className="px-4 py-1 text-white font-light tracking-wider bg-gray-900 rounded">
          <a href="/admin/addVouchers">Thêm mới</a>
        </button>
        {/* <button className="px-4 py-1 text-white font-light tracking-wider bg-gray-900 rounded"><a href="/">Trở lại</a></button> */}
      </div>
    </main>
  );
};

export default DiscountList;
