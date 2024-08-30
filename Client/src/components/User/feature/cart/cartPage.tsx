import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCartList,
  updateCartItem,
} from "../../../../redux/cart/cartThunk";
import { AppDispatch, RootState } from "../../../../redux/store";
import { CartType } from "../../../../types/cart/carts";
import { useNavigate } from "react-router-dom";
import { Button } from "flowbite-react";
// import { updateItemQuantity } from "../../../../redux/cart/cartSlice";

const CartPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const userId = useSelector(
    (state: RootState) => state.auth.profile.profile?._id
  );
  const carts = useSelector((state: RootState) => state.cart.carts);
  const cartStatus = useSelector((state: RootState) => state.cart.status);
  const cartError = useSelector((state: RootState) => state.cart.error);

  useEffect(() => {
    if (userId) {
      dispatch(fetchCartList());
    }
  }, [dispatch, userId]);

  if (cartStatus === "loading") {
    return <p>Loading...</p>;
  }

  if (cartStatus === "failed") {
    return <p>Error: {cartError}</p>;
  }

  if (!Array.isArray(carts) || carts.length === 0) {
    return <p>Giỏ hàng trống</p>;
  }

  const groupedCarts: CartType[] = [];
  const groupedMap = new Map<string, CartType>();

  carts.forEach((cart) => {
    cart.items.forEach((item) => {
      const key = item.product?._id?.toString();
      if (key) {
        if (!groupedMap.has(key)) {
          groupedMap.set(key, { ...cart, items: [item] });
        } else {
          const existingCart = groupedMap.get(key)!;
          const updatedItems = [...existingCart.items];

          const itemIndex = updatedItems.findIndex(
            (i) => i.product?._id?.toString() === item.product?._id?.toString()
          );

          if (itemIndex !== -1) {
            updatedItems[itemIndex] = {
              ...updatedItems[itemIndex],
              quantity: updatedItems[itemIndex].quantity + item.quantity,
              totalItemPrice:
                updatedItems[itemIndex].totalItemPrice + item.totalItemPrice,
            };
          } else {
            updatedItems.push(item);
          }

          existingCart.items = updatedItems;
        }
      }
    });
  });

  groupedMap.forEach((value) => groupedCarts.push(value));

  const totalCartPrice = groupedCarts.reduce((total, cart) => {
    return (
      total +
      cart.items.reduce((itemTotal, item) => {
        return itemTotal + item.totalItemPrice;
      }, 0)
    );
  }, 0);

  const handleIncreaseQuantity = async (
    cartId: string,
    itemId: string,
    currentQuantity: number
  ) => {
    const newQuantity = currentQuantity + 1;
    console.log(
      `Increasing quantity: cartId=${cartId}, itemId=${itemId}, currentQuantity=${currentQuantity}, newQuantity=${newQuantity}`
    );

    try {
      await dispatch(
        updateCartItem({
          cartId,
          itemId,
          quantity: newQuantity,
        })
      ).unwrap();
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  const handleDecreaseQuantity = async (
    cartId: string,
    itemId: string,
    currentQuantity: number
  ) => {
    if (currentQuantity > 1) {
      const newQuantity = currentQuantity - 1;
      console.log(
        `Decreasing quantity: cartId=${cartId}, itemId=${itemId}, currentQuantity=${currentQuantity}, newQuantity=${newQuantity}`
      );

      try {
        await dispatch(
          updateCartItem({
            cartId,
            itemId,
            quantity: newQuantity,
          })
        ).unwrap();
      } catch (error) {
        console.error("Failed to update quantity:", error);
      }
    }
  };

  const handleCheckout = () => {
    navigate("/checkout", { state: { groupedCarts, totalCartPrice } });
  };

  return (
    <>
      {/* container grid grid-cols-1 lg:grid-cols-12 items-start pb-16 pt-4 gap-6 */}
      <div className="container lg:col-span-8 border border-gray-200 p-4 rounded-lg shadow-sm bg-white mb-16 mt-16">
        <div className="grid md:grid-cols-3 gap-4">
          {/* Cart Items */}
          <div className="md:col-span-2 p-4 rounded-md">
            <h2 className="text-2xl font-bold text-gray-800">Giỏ hàng</h2>
            <hr className="border-gray-300 mt-4 mb-8" />

            <div className="space-y-4">
              {groupedCarts.map((cart) => (
                <div
                  key={cart._id}
                  className="grid bg-white grid-cols-3 items-center gap-4"
                >
                  <div className="col-span-2 flex items-center gap-4">
                    <div className="w-24 h-24 shrink-0 border bg-white p-2 rounded-md">
                      <img
                        src={
                          cart.items[0].product.image[0] || "default-image-url"
                        }
                        alt={`product ${cart.items[0].product.product_name}`}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-gray-800">
                        {cart.items[0].product.product_name}
                      </h3>
                      <h6 className="text-xs text-red-500 cursor-pointer mt-0.5">
                        Xóa
                      </h6>

                      <div className="flex gap-4 mt-4">
                        <button
                          type="button"
                          className="flex items-center px-2.5 py-1.5 border border-gray-300 text-gray-800 text-xs outline-none bg-transparent rounded-md"
                        >
                          <h5 className="text-gray-800 font-semibold">
                            {cart.items[0].product.weight_g} kg
                          </h5>
                        </button>

                        <div>
                          <button
                            type="button"
                            className="flex items-center px-2.5 py-1.5 border border-gray-300 text-gray-800 text-xs outline-none bg-transparent rounded-md"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-2.5 fill-current"
                              viewBox="0 0 124 124"
                              onClick={() =>
                                handleDecreaseQuantity(
                                  cart._id,
                                  cart.items[0].product._id,
                                  cart.items[0].quantity
                                )
                              }
                            >
                              <path d="M112 50H12C5.4 50 0 55.4 0 62s5.4 12 12 12h100c6.6 0 12-5.4 12-12s-5.4-12-12-12z" />
                            </svg>

                            <span className="mx-2.5">
                              {cart.items[0].quantity}
                            </span>

                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-2.5 fill-current"
                              viewBox="0 0 42 42"
                              onClick={() =>
                                handleIncreaseQuantity(
                                  cart._id,
                                  cart.items[0].product._id,
                                  cart.items[0].quantity
                                )
                              }
                            >
                              <path d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="ml-auto">
                    <h4 className="text-base font-bold text-gray-800">
                      {(
                        cart.items[0].price * cart.items[0].quantity
                      ).toLocaleString()}{" "}
                      vnđ
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gray-100 rounded-md p-4 md:sticky top-0">
            <div className="flex border border-blue-600 overflow-hidden rounded-md">
              <input
                type="text"
                placeholder="Nhập giảm giá"
                className="w-full outline-none bg-white text-gray-600 text-sm px-4 py-2.5"
              />
              <button
                type="button"
                className="flex items-center justify-center font-semibold tracking-wide bg-blue-600 hover:bg-blue-700 px-4 text-sm text-white"
              >
                Áp dụng
              </button>
            </div>

            <ul className="text-gray-800 mt-8 space-y-4">
              <li className="flex flex-wrap gap-4 text-base">
                Giảm giá <span className="ml-auto font-bold">0 VNĐ</span>
              </li>
              <li className="flex flex-wrap gap-4 text-base">
                Vận chuyển <span className="ml-auto font-bold">0 VNĐ</span>
              </li>

              <li className="flex flex-wrap gap-4 text-base font-bold">
                Tổng cộng{" "}
                <span className="ml-auto">
                  {totalCartPrice.toLocaleString()} VNĐ
                </span>
              </li>
            </ul>

            <div className="mt-8 space-y-2">
              {/* <button
                type="button"
                className="text-sm px-4 py-2.5 w-full font-semibold tracking-wide bg-blue-600 hover:bg-blue-700 text-white rounded-md"
              >
                Thanh toán
              </button> */}

              <Button
                onClick={handleCheckout}
                className="w-full bg-blue-600 font-semibold text-white hover:bg-primary-dark focus:ring-primary-light"
              >
                Thanh toán
              </Button>
              <Button className="w-full bg-blue-600 font-semibold text-white hover:bg-primary-dark focus:ring-primary-light">
                Tiếp tục mua sắm
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartPage;
