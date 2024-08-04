import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { CartItem, CartState } from "../../../../types/Voucher.d";


import listOne from "../../../../assets/images/products/product14.jpg";
import "../../../../assets/css/user.style.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
const completePage: React.FC = () => {
    const [cartState, setCartState] = useState<CartState>({
        items: [],
        totalPrice: 0,
        shipping: 0,
        applyVoucher: false,
        selectedVoucher: undefined,
      });
      const navigate = useNavigate();
      useEffect(() => {
        // Retrieve cart items from localStorage
        const storedCartItems = localStorage.getItem("cart");
        if (storedCartItems) {
          const items: CartItem[] = JSON.parse(storedCartItems);
          setCartState(prevState => ({
            ...prevState,
            items,
            totalPrice: calculateTotalPrice(items), // Calculate total price if needed
          }));
        }
      }, []);
    
      const calculateTotalPrice = (items: CartItem[]): number => {
        return items.reduce((total, item) => total + item.price * item.quantity, 0);
      };
      const handleHome = () => {
        localStorage.removeItem("cart");
    
        navigate("/"); // Redirect to the complete page
      };
  return (
    <>
   
      {/* <!-- breadcrumb --> */}
      <div className="container py-4 flex items-center gap-3">
        <a href="/" className="text-primary text-base">
          <i className="fa-solid fa-house"></i>
        </a>
        <span className="text-sm text-gray-400">
          <i className="fa-solid fa-chevron-right"></i>
        </span>
        <p className="text-gray-600 font-medium">Complete</p>
      </div>
      {/* <!-- ./breadcrumb --> */}

      {/* <!-- wrapper --> */}
      <div className="container grid grid-cols-12 items-start pb-16 pt-4 gap-6">
        <div className="col-span-8 border border-gray-200 p-4 rounded">
          <h3 className="text-lg font-medium capitalize mb-4">Hoàn thành thanh toán</h3>
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
                  
                    <div className="h-8 w-8 text-base flex items-center justify-center">
                      {item.quantity}
                    </div>
                
                  </div>
                  <p className="text-gray-800 font-medium">
                    {(item.price * item.quantity).toLocaleString()} vnđ
                  </p>
                
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

          <div className="flex justify-between border-b border-gray-200 mt-1 text-gray-800 font-medium py-3 uppercas">
            <p>Thanh toán</p>
            <p>{cartState.totalPrice.toLocaleString()} vnđ</p>
          </div>

          {/* <div className="flex justify-between border-b border-gray-200 mt-1 text-gray-800 font-medium py-3 uppercas">
            <p>Vận chuyển</p>
            <p>{cartState.shipping.toLocaleString()} vnđ</p>
          </div> */}

    

          <div className="flex justify-between text-gray-800 font-medium py-3 uppercas">
            <p className="font-semibold">Tổng thanh toán</p>
            <p>{cartState.totalPrice.toLocaleString()} vnđ</p>
          </div>

          <button
            onClick={handleHome}
            className="block w-full py-3 px-4 text-center text-white bg-primary border border-primary rounded-md 
                hover:bg-transparent hover:text-primary transition font-medium"
          >
            Hoàn thành thanh toán
          </button>
        </div>
      </div>
  
    </>
  );
};

export default completePage;
