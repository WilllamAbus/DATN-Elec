import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../../../../redux/store';
import { fetchOrderById } from '../../../../redux/checkout/checkoutThunk'; // Adjust import path as needed
// import { OrderData } from '../../../../redux/types/Checkout.d'; // Import the type

const OrderDetails: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { id } = useParams<{ id: string }>(); // Get order ID from URL params
  const { currentOrder, status, error } = useSelector((state: RootState) => state.checkout);

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderById(id));
    }
  }, [dispatch, id]);

  return (
    <main className="w-full flex-grow p-6">
      <div className="w-full mt-12">
        <p className="text-xl pb-3 flex items-center">
          <i className="fas fa-list mr-3"></i> CHI TIẾT ĐƠN HÀNG
        </p>
        {status === 'loading' && <p>Loading...</p>}
        {status === 'failed' && <p>Error: {error}</p>}
        {status === 'succeeded' && currentOrder && (
          <div className="bg-white overflow-auto">
            <table className="text-left w-full border-collapse">
              <thead>
                <tr>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">SẢN PHẨM</th>
                  <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">THANH TOÁN</th>
                  <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">SỐ LƯỢNG</th>
                  <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">PTTT</th>
                  <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">EMAIL</th>
                  <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">SHIPPING</th>
                  <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">TRẠNG THÁI</th>
                  <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">HÀNH ĐỘNG</th>
                </tr>
              </thead>
              <tbody>
              <tr>
              <td className="py-4 px-6 border-b border-grey-light">
                    <ul>
                      {currentOrder.products?.map((product: { product: string; name: string }) => (
                        <li key={product.product}>
                          {product.name}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="py-4 px-6 border-b border-grey-light">
                    {currentOrder.totalPrice ? currentOrder.totalPrice.toLocaleString() + ' VNĐ' : 'N/A'}
                  </td>
                  <td className="py-4 px-6 border-b border-grey-light">{currentOrder.quantityShopping ? currentOrder.quantityShopping.toString() : 'N/A'}</td>
                  <td className="py-4 px-6 border-b border-grey-light">{currentOrder.payment?.method || 'N/A'}</td>
                  <td className="py-4 px-6 border-b border-grey-light">
                    {currentOrder.userId?.map((user: { email: string }) => user.email).join(', ')}
                  </td>
                  <td className="py-4 px-6 border-b border-grey-light">{currentOrder.shipping?.address || 'N/A'}</td>
               
                  <td className="py-4 px-6 border-b border-grey-light">
                    <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-current">
                      {currentOrder?.status === "active" ? "Hiển thị" : "Đã ẩn"}
                    </span>
                  </td>
                  <td className="py-4 px-6 border-b border-grey-light">
                         
                  <button
                      className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                      // onClick={() => handlesoftDeleteProduct(product._id)}
                    >
                      Xoá
                    </button>
                       </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
};

export default OrderDetails;
