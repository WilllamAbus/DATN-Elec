import React from "react";
import listOne from "../../../../assets/images/products/product14.jpg";
import "../../../../assets/css/user.style.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Modal from "../../MoalButton";
import { getUserData } from "../../../../middleware/getToken";
import { Voucher, CartItem, CartState } from "../../../../types/Voucher.d";
// Define an interface for cart item

const CartPage: React.FC = () => {
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
    const userData = getUserData();
    if (userData) {
      const isAdmin = userData.roles.some((role) => role.name === "admin");
      if (isAdmin) {
        navigate("/login");
      } else {
        navigate("/checkout");
      }
    } else {
      navigate("/login");
    }
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
            {["product1", "product2", "product3"].map((_, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    src={listOne}
                    alt={`product ${index + 1}`}
                    className="w-28 h-10"
                  />
                  <h5 className="text-gray-800 font-medium">Italian shape</h5>
                </div>
                <p className="text-gray-600">x3</p>
                <p className="text-gray-800 font-medium">20.000 vnđ</p>
                <button className="ml-2 text-gray-600 hover:text-red-600 focus:outline-none">
                  <i className="fa-sharp fa-solid fa-trash"></i>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-4 border border-gray-200 p-4 rounded">
          <h4 className="text-gray-800 text-lg mb-4 font-medium uppercase">
            Tổng thanh toán
          </h4>
          <div className="flex justify-between border-b border-gray-200 mt-1 text-gray-800 font-medium py-3 uppercase">
            <p>Thanh toán</p>
            <p>128.000 vnđ</p>
          </div>
          <div className="flex justify-between border-b border-gray-200 mt-1 text-gray-800 font-medium py-3 uppercase">
            <p>Vận chuyển</p>
            <p>Miễn phí</p>
          </div>
          <div className="flex justify-between text-gray-800 font-medium py-3 uppercase">
            <p className="font-semibold">Tổng cộng</p>
            <p>128.000 vnđ</p>
          </div>

          <a
            href="/checkout"
            className="block w-full py-3 px-4 text-center text-white bg-primary border border-primary rounded-md 
                hover:bg-transparent hover:text-primary transition font-medium"
          >
            Thanh toán
          </a>
          <br />
          <Modal />
        </div>
      </div>
    </>
  );
};

export default CartPage;
