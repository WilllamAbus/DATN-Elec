// DiscountList.tsx
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../../redux/store'; // Import your RootState type
import { fetchDiscounts, deleteDiscount } from '../../../../redux/discount/discountThunk'; // Import the thunk actions
import AlertCustomStyles from '../../../../ultils/alert.succes'; // Import your custom Alert component
import { Link } from 'react-router-dom';

const DiscountList: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const { discounts, loading, error } = useSelector((state: RootState) => state.discount);
    const [alert, setAlert] = useState<{ message: string; type: "success" | "error" | null }>({ message: '', type: null });
  
    useEffect(() => {
      dispatch(fetchDiscounts());
    }, [dispatch]);
  
    const handleDelete = async (id: string) => {
      if (window.confirm('Are you sure you want to delete this discount?')) {
        try {
          await dispatch(deleteDiscount(id)).unwrap();
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
              {discounts.map((discount) => (
                <tr key={discount._id} className="hover:bg-grey-lighter">
                  <td className="py-4 px-6 border-b border-grey-light">{discount.code}</td>
                  <td className="py-4 px-6 border-b border-grey-light">{discount.discountNum}</td> 
                  <td className="py-4 px-6 border-b border-grey-light">{discount.expiryDate}</td> 
                  <td className="py-4 px-6 border-b border-grey-light">
                    {discount.cateReady.map((category, index) => (
                      <div key={index}>{category.name}</div>
                    ))}
                  </td>
                  <td className="py-4 px-6 border-b border-grey-light">{discount.conditionActive}</td> 
                  <td className="py-4 px-6 border-b border-grey-light">
                    <button
                      className="cta-btn btn text-red-500"
                      onClick={() => handleDelete(discount._id)}
                    >
                      Xoá
                    </button>
                    <Link to={`/admin/editDiscounts/${discount._id}`}
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
          <a href="/admin/addDiscounts">Thêm mới</a>
        </button>
        {/* <button className="px-4 py-1 text-white font-light tracking-wider bg-gray-900 rounded"><a href="/">Trở lại</a></button> */}
      </div>
    </main>
  );
};

export default DiscountList;
