import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import listOne from "../../../../assets/images/products/product14.jpg";
import "../../../../assets/css/user.style.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Modal from "../../MoalButton";

import { Voucher, CartItem , CartState} from "../../../../types/Voucher.d";
// Define an interface for cart item


const CartPage: React.FC = () => {
  const [cartState, setCartState] = useState<CartState>({
    items: [],
    totalPrice: 0,
    shipping: 25000,
    applyVoucher: false,
    selectedVoucher: undefined,
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch cart data from localStorage
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartState((prevState) => ({
      ...prevState,
      items: cart,
      totalPrice: calculateTotal(cart),
    }));
  }, []);

  const handleRemoveItem = (id: string) => {
    const updatedItems = cartState.items.filter((item) => item.id !== id);
    localStorage.setItem("cart", JSON.stringify(updatedItems));
    setCartState((prevState) => ({
      ...prevState,
      items: updatedItems,
      totalPrice: calculateTotal(updatedItems),
    }));
  };

  const increaseQuantity = (id: string) => {
    const updatedItems = cartState.items.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    localStorage.setItem("cart", JSON.stringify(updatedItems));
    setCartState((prevState) => ({
      ...prevState,
      items: updatedItems,
      totalPrice: calculateTotal(updatedItems),
    }));
  };

  const decreaseQuantity = (id: string) => {
    const updatedItems = cartState.items.map((item) =>
      item.id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    localStorage.setItem("cart", JSON.stringify(updatedItems));
    setCartState((prevState) => ({
      ...prevState,
      items: updatedItems,
      totalPrice: calculateTotal(updatedItems),
    }));
  };

  const calculateTotal = (items: CartItem[]) => {
    const subtotal = items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    return subtotal - (cartState.selectedVoucher?.voucherNum || 0);
  };

  const calculateGrandTotal = () => {
    return cartState.totalPrice + cartState.shipping;
  };

  const handleVoucherApply = (voucher: Voucher) => {
    setCartState((prevState) => ({
      ...prevState,
      applyVoucher: true,
      selectedVoucher: voucher,
      totalPrice: calculateTotal(prevState.items),
    }));
  };

  const handleCheckout = () => {
    localStorage.setItem("cart", JSON.stringify(cartState.items));
    navigate("/checkout");
  };

  return (
    <>
      {/* breadcrumb */}
      <div className="container py-4 flex items-center gap-3">
        <a href="/" className="text-primary text-base">
          <i className="fa-solid fa-house"></i>
        </a>
        <span className="text-sm text-gray-400">
          <i className="fa-solid fa-chevron-right"></i>
        </span>
        <p className="text-gray-600 font-medium">Cart</p>
      </div>
      {/* ./breadcrumb */}

      {/* wrapper */}
      <div className="container grid grid-cols-12 items-start pb-16 pt-4 gap-6">
        <div className="col-span-8 border border-gray-200 p-4 rounded">
          <h3 className="text-lg font-medium capitalize mb-4">Giỏ hàng</h3>
          <div className="space-y-4">
            {/* Product Items */}
            {cartState.items.length > 0 ? (
              cartState.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src={item.imgPreview || listOne}
                      alt={`product ${item.name}`}
                      className="w-28 h-10"
                    />
                  
                  </div>
                  <h5 className="text-gray-800 font-medium">{item.name}</h5>
                  <div className="flex border border-gray-300 text-gray-600 divide-x divide-gray-300 w-max">
                    <div
                      className="h-8 w-8 text-xl flex items-center justify-center cursor-pointer select-none"
                      onClick={() => decreaseQuantity(item.id)}
                    >
                      -
                    </div>
                    <div className="h-8 w-8 text-base flex items-center justify-center">
                      {item.quantity}
                    </div>
                    <div
                      className="h-8 w-8 text-xl flex items-center justify-center cursor-pointer select-none"
                      onClick={() => increaseQuantity(item.id)}
                    >
                      +
                    </div>
                  </div>
                  <p className="text-gray-800 font-medium">
                    {(item.price * item.quantity).toLocaleString()} vnđ
                  </p>
                  <button
                    className="ml-2 text-gray-600 hover:text-red-600 focus:outline-none"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    <i className="fa-sharp fa-solid fa-trash"></i>
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-600">Giỏ hàng trống</p>
            )}
          </div>
        </div>

        <div className="col-span-4 border border-gray-200 p-4 rounded">
          <h4 className="text-gray-800 text-lg mb-4 font-medium uppercase">
            Tổng thanh toán
          </h4>
          <div className="flex justify-between border-b border-gray-200 mt-1 text-gray-800 font-medium py-3 uppercase">
            <p>Thanh toán</p>
            <p>{cartState.totalPrice.toLocaleString()} vnđ</p>
          </div>
          <div className="flex justify-between border-b border-gray-200 mt-1 text-gray-800 font-medium py-3 uppercase">
            <p>Vận chuyển</p>
            <p>{cartState.shipping.toLocaleString()} vnđ</p>
          </div>
          <div className="flex justify-between border-b border-gray-200 mt-1 text-gray-800 font-medium py-3 uppercase">
            <p>Giảm giá</p>
            <p>{(cartState.selectedVoucher?.voucherNum || 0).toLocaleString()} vnđ</p>
          </div>
          <div className="flex justify-between text-gray-800 font-medium py-3 uppercase">
            <p className="font-semibold">Tổng cộng</p>
            <p>{calculateGrandTotal().toLocaleString()} vnđ</p>
          </div>

          <button
            onClick={handleCheckout}
            className="block w-full py-3 px-4 text-center text-white bg-primary border border-primary rounded-md 
                hover:bg-transparent hover:text-primary transition font-medium"
          >
            Thanh toán
          </button>
          <br />
          <Modal onVoucherApply={handleVoucherApply} />
        </div>
      </div>
    </>
  );
};

export default CartPage;
