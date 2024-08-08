import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../redux/store"; // Adjust the import path as needed
import { fetchAllOrdersThunk } from "../../../../redux/checkout/checkoutThunk"; // Adjust the import path as needed
import "../../../../assets/css/admin.style.css";
import { Link } from "react-router-dom";

const ListOrders: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { orders, status, error } = useSelector((state: RootState) => state.checkout);

  useEffect(() => {
    dispatch(fetchAllOrdersThunk());
  }, [dispatch]);



  return (
    <>
       <>
       <main className="w-full flex-grow p-6">
              <div className="w-full mt-12">
                <p className="text-xl pb-3 flex items-center">
                  <i className="fas fa-list mr-3"></i> DANH SÁCH ĐƠN HÀNG
                </p>
                <div className="bg-white overflow-auto">
                  <table className="text-left w-full border-collapse">
                    <thead>
                      <tr>
                    
                     
                        <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">EMAIL</th>
                       
                        <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">VẬN CHUYỂN</th>
                        <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">PTTT</th>
                        <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">HÀNH ĐỘNG</th>
                      </tr>
                    </thead>
                    <tbody>
                      {status === 'loading' && (
                        <tr>
                          <td colSpan={8} className="py-4 px-6 border-b border-grey-light text-center">Loading...</td>
                        </tr>
                      )}
                      {status === 'failed' && (
                        <tr>
                          <td colSpan={8} className="py-4 px-6 border-b border-grey-light text-center text-red-500">Error: {error}</td>
                        </tr>
                      )}
                      {orders.map((order) => (
                        <tr key={order._id || 'no-id'} className="hover:bg-grey-lighter">
                         
                       
                          <td className="py-4 px-6 border-b border-grey-light">{order.userId.map(user => user.email).join(', ')}</td>
                        
                          <td className="py-4 px-6 border-b border-grey-light">
                            {order.shipping.address || 'N/A'} {/* Replace 'address' with the correct property if needed */}
                          </td>
                          <td className="py-4 px-6 border-b border-grey-light">{order.payment.method}</td>
                          
                          <td className="py-4 px-6 border-b border-grey-light">
                         
                            <Link
                              to={`/admin/listDetailOrder/${order._id}`}
                              className="focus:outline-none
                       text-white
                        bg-green-700
                         hover:bg-green-800 
                         focus:ring-4
                          focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2
                           dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                              Chi tiết
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </main>
    </>
  </>
  );
};

export default ListOrders;
