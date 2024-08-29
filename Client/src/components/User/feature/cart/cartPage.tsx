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
  const cartss = useSelector(
    (state: RootState) => state.cart.carts[0].totalPrice
  );
  const cartStatus = useSelector((state: RootState) => state.cart.status);
  const cartError = useSelector((state: RootState) => state.cart.error);
  console.log(cartss);

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

      // Dispatch an action to update the item quantity in the Redux store
      // This step may not be necessary if the `updateCartItem` is updating the store correctly.
      // dispatch(updateItemQuantity({ cartId, itemId, quantity: newQuantity }));

      // Force a re-render by updating local state if necessary
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

        // Dispatch an action to update the item quantity in the Redux store
        // This step may not be necessary if the `updateCartItem` is updating the store correctly.
        // dispatch(updateItemQuantity({ cartId, itemId, quantity: newQuantity }));

        // Force a re-render by updating local state if necessary
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
      {/* Breadcrumb */}
      <div className="container py-4 flex items-center gap-3">
        <a href="/" className="text-primary text-base hover:underline">
          <i className="fa-solid fa-house"></i>
        </a>
        <span className="text-sm text-gray-400">
          <i className="fa-solid fa-chevron-right"></i>
        </span>
      </div>
      {/* ./Breadcrumb */}

      {/* Wrapper */}
      <div className="container grid grid-cols-12 items-start pb-16 pt-4 gap-6">
        {/* Cart Items */}
        <div className="col-span-8 border border-gray-200 p-4 rounded-lg shadow-sm bg-white">
          <h3 className="text-lg font-semibold capitalize mb-4">Giỏ hàng</h3>
          <div className="space-y-4">
            {groupedCarts.map((cart) => (
              <div
                key={cart._id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50"
              >
                <div className="flex items-center">
                  <img
                    src={cart.items[0].product.image[0] || "default-image-url"}
                    alt={`product ${cart.items[0].product.product_name}`}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                </div>
                <h5 className="text-gray-800 font-semibold">
                  {cart.items[0].product.product_name}
                </h5>
                <div className="flex border border-gray-300 text-gray-600 divide-x divide-gray-300 rounded-md overflow-hidden">
                  <button
                    className="h-8 w-8 text-xl flex items-center justify-center bg-gray-200 hover:bg-gray-300"
                    onClick={() =>
                      handleDecreaseQuantity(
                        cart._id,
                        cart.items[0].product._id,
                        cart.items[0].quantity
                      )
                    }
                  >
                    -
                  </button>
                  <div className="h-8 w-8 text-base flex items-center justify-center bg-gray-100">
                    {cart.items[0].quantity}
                  </div>
                  <button
                    className="h-8 w-8 text-xl flex items-center justify-center bg-gray-200 hover:bg-gray-300"
                    onClick={() =>
                      handleIncreaseQuantity(
                        cart._id,
                        cart.items[0].product._id,
                        cart.items[0].quantity
                      )
                    }
                  >
                    +
                  </button>
                </div>
                <p className="text-gray-800 font-semibold">
                  {(
                    cart.items[0].price * cart.items[0].quantity
                  ).toLocaleString()}{" "}
                  vnđ
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="col-span-4 border border-gray-200 p-4 rounded-lg shadow-sm bg-white">
          <h4 className="text-gray-800 text-lg mb-4 font-semibold uppercase">
            Tổng thanh toán
          </h4>
          <div className="flex justify-between border-b border-gray-200 mb-3 pb-2 text-gray-800 font-semibold uppercase">
            <p>Thanh toán</p>
            <p>{totalCartPrice.toLocaleString()} vnđ</p>
          </div>
          <Button
            onClick={handleCheckout}
            className="bg-blue-600 text-white hover:bg-primary-dark focus:ring-primary-light"
          >
            Thanh toán
          </Button>
        </div>
      </div>
    </>
  );
};

export default CartPage;
