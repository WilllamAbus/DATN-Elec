import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import listOne from "../../../../assets/images/products/product14.jpg";
import "../../../../assets/css/user.style.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Modal from "../../MoalButton";
import { getUserData, getUserDataV2 } from "../../../../middleware/getToken";
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
    // Retrieve cart and voucher from local storage
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const storedVoucher = JSON.parse(localStorage.getItem("selectedVoucher") || "null");

  

    // Update cart state with retrieved data
    const updatedTotalPrice = calculateTotal(cart, storedVoucher);
  

    setCartState({
      items: cart,
      selectedVoucher: storedVoucher || undefined,
      applyVoucher: !!storedVoucher,
      totalPrice: updatedTotalPrice,
      shipping: 25000, // Assuming static shipping cost for this example
    });
  }, []);

  const calculateTotal = (items: CartItem[], voucher?: Voucher) => {
    // Calculate subtotal
    const subtotal = items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
 

    // Calculate discount
    const discount = voucher ? voucher.voucherNum : 0;
   

    const totalPrice = subtotal - discount;


    // Ensure totalPrice doesn't go below zero
    return Math.max(totalPrice, 0);
  };

  const calculateGrandTotal = () => {
    const grandTotal = cartState.totalPrice + cartState.shipping;
    console.log("Grand Total:", grandTotal);
    return grandTotal;
  };

  const handleRemoveItem = (id: string) => {
    const updatedItems = cartState.items.filter((item) => item.id !== id);
   

    localStorage.setItem("cart", JSON.stringify(updatedItems));
    const newTotalPrice = calculateTotal(updatedItems, cartState.selectedVoucher);
 

    setCartState((prevState) => ({
      ...prevState,
      items: updatedItems,
      totalPrice: newTotalPrice,
    }));
  };

  const increaseQuantity = (id: string) => {
    const updatedItems = cartState.items.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
   

    localStorage.setItem("cart", JSON.stringify(updatedItems));
    const newTotalPrice = calculateTotal(updatedItems, cartState.selectedVoucher);
   

    setCartState((prevState) => ({
      ...prevState,
      items: updatedItems,
      totalPrice: newTotalPrice,
    }));
  };

  const decreaseQuantity = (id: string) => {
    const updatedItems = cartState.items.map((item) =>
      item.id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    console.log("Updated Items after Decreasing Quantity:", updatedItems);

    localStorage.setItem("cart", JSON.stringify(updatedItems));
    const newTotalPrice = calculateTotal(updatedItems, cartState.selectedVoucher);
    console.log("New Total Price after Decreasing Quantity:", newTotalPrice);

    setCartState((prevState) => ({
      ...prevState,
      items: updatedItems,
      totalPrice: newTotalPrice,
    }));
  };

  const handleVoucherApply = (voucher: Voucher) => {
    const newTotalPrice = calculateTotal(cartState.items, voucher);
    console.log("Applying Voucher:", voucher);
    console.log("New Total Price after Applying Voucher:", newTotalPrice);

    setCartState((prevState) => ({
      ...prevState,
      applyVoucher: true,
      selectedVoucher: voucher,
      totalPrice: newTotalPrice,
    }));
    localStorage.setItem("selectedVoucher", JSON.stringify(voucher));
  };

  const handleCheckout = () => {
    // Calculate and store the grand total in localStorage or state
    const grandTotal = calculateGrandTotal();
    console.log("Grand Total for Checkout:", grandTotal);

    localStorage.setItem("cart", JSON.stringify(cartState.items));
    localStorage.setItem("grandTotal", JSON.stringify(grandTotal));
    const storedVoucher = JSON.parse(localStorage.getItem("selectedVoucher") || "null");
    if (storedVoucher) {
      localStorage.setItem("selectedVoucher", JSON.stringify(storedVoucher));
    }
    const userData = getUserData();

    const userDataV2 = getUserDataV2();
    if (userData ||userDataV2) {
      const isAdmin = userData.roles.some(role => role.name === 'admin');
      const isAdminV2 = userDataV2 .roles.some(role => role.name === 'admin');
      if (isAdmin || isAdminV2) {
        navigate('/login');
      } else {
        navigate('/checkout');
      }
    } else {
      navigate('/login');
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
