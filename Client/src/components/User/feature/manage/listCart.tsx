import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartItem, CartState } from "../../../../types/Voucher.d";
// import "../../../../assets/css/user.style.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { getUserData } from "../../../../middleware/getToken";

const ListCart: React.FC = () => {
  const [cartState, setCartState] = useState<CartState>({
    items: [],
    totalPrice: 0,
    shipping: 0,
    applyVoucher: false,
    selectedVoucher: undefined,
  });
  const [grandTotal, setGrandTotal] = useState<number>(0);
  const [, setVoucher] = useState<{
    code: string;
    discount: number;
  } | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const storedCartItems = localStorage.getItem("cart");
    const storedGrandTotal = localStorage.getItem("grandTotal");
    const storedVoucher = JSON.parse(
      localStorage.getItem("selectedVoucher") || "null"
    );

    if (storedCartItems) {
      const items: CartItem[] = JSON.parse(storedCartItems);
      setCartState((prevState) => ({
        ...prevState,
        items,
        totalPrice: calculateTotalPrice(items),
      }));
    }

    if (storedGrandTotal) {
      setGrandTotal(JSON.parse(storedGrandTotal));
    }
    if (storedVoucher) {
      setVoucher(storedVoucher);
    }
  }, []);

  const calculateTotalPrice = (items: CartItem[]): number => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const userData = getUserData();
  const userRole = userData.roles.find((role) => role.name === "user");

  useEffect(() => {
    if (!userRole) {
      navigate("/not-authorized");
    }
  }, [userRole, navigate]);

  if (!userRole) {
    return <div>You are not authorized to view this page.</div>;
  }

  return (
    <>
      <div className="col-span-9 shadow rounded px-6 pt-5 pb-7">
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Email
                </th>
                <th scope="col" className="px-6 py-3">
                  Hình ảnh
                </th>
                <th scope="col" className="px-6 py-3">
                  Tên sản phẩm
                </th>
                <th scope="col" className="px-6 py-3">
                  Số lượng
                </th>
                <th scope="col" className="px-6 py-3">
                  Giá
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Hiển thị email của người dùng */}
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td className="px-6 py-4">{userData.email}</td>
                <td colSpan={4}></td>{" "}
                {/* Khoảng trống để tránh trùng lặp các cột khác */}
              </tr>

              {/* Hiển thị các mục giỏ hàng */}
              {cartState.items.map((item, index) => (
                <tr
                  key={index}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <td className="px-6 py-4"></td>{" "}
                  {/* Giữ khoảng trống cho email */}
                  <td className="px-6 py-4">
                    <img
                      src={item.imgPreview}
                      alt={`product ${item.name}`}
                      className="w-28 h-28 object-cover"
                    />
                  </td>
                  <td className="px-6 py-4">{item.name}</td>
                  <td className="px-6 py-4">{item.quantity}</td>
                  <td className="px-6 py-4">
                    {item.price.toLocaleString()} vnđ
                  </td>
                </tr>
              ))}

              {/* Hiển thị dòng Thanh toán */}
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td className="px-6 py-4 font-bold" colSpan={4}>
                  Thanh toán
                </td>
                <td className="px-6 py-4 font-bold">
                  {grandTotal.toLocaleString()} vnđ
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ListCart;
