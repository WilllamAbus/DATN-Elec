import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCart,
  fetchCartList,
  updateCartItem,
} from "../../../../redux/cart/cartThunk";
import { AppDispatch, RootState } from "../../../../redux/store";
import { CartType } from "../../../../types/cart/carts";
import { useNavigate } from "react-router-dom";
import { Button } from "flowbite-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CartPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const userId = useSelector(
    (state: RootState) => state.auth.profile.profile?._id
  );
  const carts = useSelector((state: RootState) => state.cart.carts);
  const cartStatus = useSelector((state: RootState) => state.cart.status);
  const cartError = useSelector((state: RootState) => state.cart.error);

  const [itemQuantities, setItemQuantities] = useState<{
    [key: string]: number;
  }>({});
  const [totalCartPrice, setTotalCartPrice] = useState(0);

  useEffect(() => {
    if (userId) {
      dispatch(fetchCartList());
    }
  }, [dispatch, userId]);

  useEffect(() => {
    console.log("Carts updated:", carts);

    const newItemQuantities: { [key: string]: number } = {};
    carts.forEach((cart) => {
      cart.items.forEach((item) => {
        newItemQuantities[item.product._id] = item.quantity;
      });
    });
    setItemQuantities(newItemQuantities);
  }, [carts]);

  useEffect(() => {
    const total = carts.reduce((total, cart) => {
      return (
        total +
        cart.items.reduce((itemTotal, item) => {
          const quantity = itemQuantities[item.product._id] || item.quantity;
          return itemTotal + (item.product.product_price_unit || 0) * quantity;
        }, 0)
      );
    }, 0);
    setTotalCartPrice(total);
  }, [carts, itemQuantities]);

  const handleQuantityChange = async (
    cartId: string,
    itemId: string,
    newQuantity: number
  ) => {
    const item = carts
      .flatMap((cart) => cart.items)
      .find((i) => i.product._id === itemId);

    if (item) {
      const stock = item.product.product_quantity; // Số lượng tồn kho
      if (newQuantity > stock) {
        toast.error(
          `Số lượng không được vượt quá ${stock} sản phẩm có sẵn trong kho.`
        );
        return;
      }
    }

    const validQuantity = Math.max(1, newQuantity);
    try {
      await dispatch(
        updateCartItem({
          cartId,
          itemId,
          quantity: validQuantity,
        })
      ).unwrap();
      setItemQuantities((prevQuantities) => ({
        ...prevQuantities,
        [itemId]: validQuantity,
      }));
    } catch (error) {
      console.error("Failed to update quantity:", error);
      toast.error("Cập nhật số lượng thất bại.");
    }
  };

  const handleBlur = async (
    cartId: string,
    itemId: string,
    currentQuantity: string
  ) => {
    const newQuantity =
      currentQuantity === "" ? 1 : Math.max(1, Number(currentQuantity));

    const item = carts
      .flatMap((cart) => cart.items)
      .find((i) => i.product._id === itemId);

    if (item) {
      const stock = item.product.product_quantity; // Số lượng tồn kho

      if (newQuantity > stock) {
        toast.error(
          `Số lượng không được vượt quá ${stock} sản phẩm có sẵn trong kho.`
        );
        setItemQuantities((prevQuantities) => ({
          ...prevQuantities,
          [itemId]: item.quantity,
        }));
        return;
      }
    }

    await handleQuantityChange(cartId, itemId, newQuantity);
  };

  const handleDecreaseQuantity = (
    cartId: string,
    itemId: string,
    currentQuantity: number
  ) => {
    const newQuantity = Math.max(1, currentQuantity - 1);
    handleQuantityChange(cartId, itemId, newQuantity);
  };

  const handleIncreaseQuantity = (
    cartId: string,
    itemId: string,
    currentQuantity: number
  ) => {
    handleQuantityChange(cartId, itemId, currentQuantity + 1);
  };

  const handleCheckout = () => {
    navigate("/checkout", { state: { groupedCarts, totalCartPrice } });
  };
  const handleDeleteProduct = async (cartId: string, productId: string) => {
    try {
      await dispatch(deleteCart({ cartId, productId })).unwrap();
      toast.success("Sản phẩm đã được xóa khỏi giỏ hàng.");
    } catch (error) {
      toast.error("Xóa sản phẩm thất bại.");
    }
  };
  if (cartStatus === "loading") {
    return <p>Loading...</p>;
  }

  if (cartStatus === "failed") {
    toast.error(`Error: ${cartError}`);
    return <p>Error: {cartError}</p>;
  }

  if (!Array.isArray(carts) || carts.length === 0) {
    return <p>Giỏ hàng trống</p>;
  }

  const groupedMap = new Map<string, CartType>();
  const groupedCarts: CartType[] = [];
  const filteredCarts = carts.filter(
    (cart): cart is CartType =>
      cart !== null && cart !== undefined && Array.isArray(cart.items)
  );

  filteredCarts.forEach((cart) => {
    cart.items.forEach((item) => {
      const key = item.product._id;
      if (key) {
        if (!groupedMap.has(key)) {
          groupedMap.set(key, { ...cart, items: [item] });
        } else {
          const existingCart = groupedMap.get(key)!;
          const updatedItems = [...existingCart.items];

          const itemIndex = updatedItems.findIndex(
            (i) => i.product._id === item.product._id
          );

          if (itemIndex !== -1) {
            updatedItems[itemIndex] = {
              ...updatedItems[itemIndex],
              quantity: updatedItems[itemIndex].quantity + item.quantity,
              totalItemPrice:
                updatedItems[itemIndex].totalItemPrice +
                item.product.product_price_unit * item.quantity,
            };
          } else {
            // Trường hợp thêm mới sản phẩm vào giỏ hàng
            updatedItems.push({
              ...item,
              totalItemPrice: item.product.product_price_unit * item.quantity,
            });
          }

          existingCart.items = updatedItems;
        }
      }
    });
  });

  groupedMap.forEach((cart) => {
    groupedCarts.push(cart);
  });

  // groupedMap.forEach((value) => groupedCarts.push(value));

  return (
    <div className="container lg:col-span-8 border border-gray-200 p-4 rounded-lg shadow-sm bg-white mb-16 mt-16">
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 p-4 rounded-md">
          <h2 className="text-2xl font-bold text-gray-800">Giỏ hàng</h2>
          <hr className="border-gray-300 mt-4 mb-8" />

          <div className="space-y-4">
            {groupedCarts.map((cart) => (
              <div
                key={`${cart._id}-${cart.items[0].product._id}`}
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
                    <h6
                      onClick={() =>
                        handleDeleteProduct(cart._id, cart.items[0].product._id)
                      }
                      className="text-xs text-red-500 cursor-pointer mt-0.5"
                    >
                      Xóa
                    </h6>
                    {/* <Button
                      onClick={() =>
                        handleDeleteProduct(cart._id, cart.items[0].product._id)
                      }
                    >
                      Xóa sản phẩm
                    </Button> */}
                    <div className="flex gap-4 mt-4">
                      <button
                        type="button"
                        className="flex items-center px-2.5 py-1.5 border border-gray-300 text-gray-800 text-xs outline-none bg-transparent rounded-md"
                      >
                        <h5 className="text-gray-800 font-semibold">
                          {cart.items[0].product.weight_g} kg
                        </h5>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="flex items-center justify-center w-8 h-8 border border-gray-300 text-gray-800 text-xs outline-none bg-transparent rounded-md"
                          onClick={() =>
                            handleDecreaseQuantity(
                              cart._id,
                              cart.items[0].product._id,
                              itemQuantities[cart.items[0].product._id] ||
                                cart.items[0].quantity
                            )
                          }
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-3 fill-current"
                            viewBox="0 0 124 124"
                          >
                            <path d="M112 50H12c-6.6 0-10.8-1.8-10.8-6.5S5.4 37 12 37h100c6.6 0 10.8 1.8 10.8 6.5S118.6 50 112 50z" />
                          </svg>
                        </button>

                        <input
                          type="text"
                          className="w-12 text-center border border-gray-300 text-gray-800 text-xs rounded-md"
                          value={
                            itemQuantities[cart.items[0].product._id] ||
                            cart.items[0].quantity
                          }
                          onChange={(e) => {
                            const newQuantity = Number(e.target.value);
                            if (!isNaN(newQuantity) && newQuantity >= 1) {
                              setItemQuantities((prevQuantities) => ({
                                ...prevQuantities,
                                [cart.items[0].product._id]: newQuantity,
                              }));
                            }
                          }}
                          onBlur={(e) =>
                            handleBlur(
                              cart._id,
                              cart.items[0].product._id,
                              e.target.value
                            )
                          }
                        />

                        <button
                          type="button"
                          className="flex items-center justify-center w-8 h-8 border border-gray-300 text-gray-800 text-xs outline-none bg-transparent rounded-md"
                          onClick={() =>
                            handleIncreaseQuantity(
                              cart._id,
                              cart.items[0].product._id,
                              itemQuantities[cart.items[0].product._id] ||
                                cart.items[0].quantity
                            )
                          }
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-3 fill-current"
                            viewBox="0 0 42 42"
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
                    {cart.items[0].product.product_price_unit.toLocaleString(
                      "vi-VN"
                    )}{" "}
                    VND
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-md bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">Tổng cộng</h2>
          <hr className="border-gray-300 mt-4 mb-8" />
          <h3 className="text-gray-800">Danh sách sản phẩm:</h3>
          {groupedCarts.map((cart) => (
            <div key={cart._id} className="flex justify-between mt-2">
              <span className="text-gray-800">
                {cart.items[0].product.product_name} x{" "}
                {itemQuantities[cart.items[0].product._id] ||
                  cart.items[0].quantity}
              </span>
            </div>
          ))}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-gray-800">Tạm tính:</p>
              <p className="font-bold text-gray-800">
                {totalCartPrice.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </p>
            </div>

            <div className="flex justify-between items-center">
              <p className="text-gray-800">Phí vận chuyển:</p>
              <p className="font-bold text-gray-800">50.000₫</p>
            </div>
          </div>

          <hr className="border-gray-300 mt-4 mb-8" />

          <div className="flex justify-between items-center">
            <p className="text-lg font-bold text-gray-800">Tổng cộng:</p>
            <p className="text-xl font-bold text-red-600">
              {(totalCartPrice + 50000).toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </p>
          </div>
          <div className="mt-8 space-y-2">
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

      <ToastContainer />
    </div>
  );
};

export default CartPage;
// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchCartList,
//   updateCartItem,
//   // deleteProductFromCart,
// } from "../../../../redux/cart/cartThunk";
// import { AppDispatch, RootState } from "../../../../redux/store";
// import { CartType } from "../../../../types/cart/carts";
// import { useNavigate } from "react-router-dom";
// import { Button } from "flowbite-react";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const CartPage: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const navigate = useNavigate();
//   const userId = useSelector(
//     (state: RootState) => state.auth.profile.profile?._id
//   );
//   const carts = useSelector((state: RootState) => state.cart.carts);
//   const cartStatus = useSelector((state: RootState) => state.cart.status);
//   const cartError = useSelector((state: RootState) => state.cart.error);
//   console.log(carts);

//   const [itemQuantities, setItemQuantities] = useState<{
//     [key: string]: number;
//   }>({});
//   const [totalCartPrice, setTotalCartPrice] = useState(0);

//   useEffect(() => {
//     if (userId) {
//       dispatch(fetchCartList());
//     }
//   }, [dispatch, userId]);

//   useEffect(() => {
//     if (carts) {
//       const newItemQuantities: { [key: string]: number } = {};
//       carts.forEach((cart) => {
//         cart.items?.forEach((item) => {
//           newItemQuantities[item.product._id] = item.quantity;
//         });
//       });
//       setItemQuantities(newItemQuantities);
//     }
//   }, [carts]);

//   useEffect(() => {
//     if (carts) {
//       const total = carts.reduce((total, cart) => {
//         return (
//           total +
//           (cart.items?.reduce((itemTotal, item) => {
//             const quantity = itemQuantities[item.product._id] || item.quantity;
//             return itemTotal + (item.product.product_price || 0) * quantity;
//           }, 0) || 0)
//         );
//       }, 0);
//       setTotalCartPrice(total);
//     }
//   }, [carts, itemQuantities]);

//   const handleQuantityChange = async (
//     cartId: string,
//     itemId: string,
//     newQuantity: number
//   ) => {
//     const item = carts
//       .flatMap((cart) => cart.items || [])
//       .find((i) => i.product._id === itemId);

//     if (item) {
//       const stock = item.product.product_quantity;
//       if (newQuantity > stock) {
//         toast.error(
//           `Số lượng không được vượt quá ${stock} sản phẩm có sẵn trong kho.`
//         );
//         return;
//       }
//     }

//     const validQuantity = Math.max(1, newQuantity);
//     try {
//       await dispatch(
//         updateCartItem({
//           cartId,
//           itemId,
//           quantity: validQuantity,
//         })
//       ).unwrap();
//       setItemQuantities((prevQuantities) => ({
//         ...prevQuantities,
//         [itemId]: validQuantity,
//       }));
//     } catch (error) {
//       console.error("Failed to update quantity:", error);
//       toast.error("Cập nhật số lượng thất bại.");
//     }
//   };

//   const handleBlur = async (
//     cartId: string,
//     itemId: string,
//     currentQuantity: string
//   ) => {
//     const newQuantity =
//       currentQuantity === "" ? 1 : Math.max(1, Number(currentQuantity));

//     const item = carts
//       .flatMap((cart) => cart.items || [])
//       .find((i) => i.product._id === itemId);

//     if (item) {
//       const stock = item.product.product_quantity;

//       if (newQuantity > stock) {
//         toast.error(
//           `Số lượng không được vượt quá ${stock} sản phẩm có sẵn trong kho.`
//         );
//         setItemQuantities((prevQuantities) => ({
//           ...prevQuantities,
//           [itemId]: item.quantity,
//         }));
//         return;
//       }
//     }

//     await handleQuantityChange(cartId, itemId, newQuantity);
//   };

//   const handleDecreaseQuantity = (
//     cartId: string,
//     itemId: string,
//     currentQuantity: number
//   ) => {
//     const newQuantity = Math.max(1, currentQuantity - 1);
//     handleQuantityChange(cartId, itemId, newQuantity);
//   };

//   const handleIncreaseQuantity = (
//     cartId: string,
//     itemId: string,
//     currentQuantity: number
//   ) => {
//     handleQuantityChange(cartId, itemId, currentQuantity + 1);
//   };

//   const handleCheckout = () => {
//     navigate("/checkout", { state: { groupedCarts, totalCartPrice } });
//   };

//   // const handleDeleteProduct = async (cartId: string, productId: string) => {
//   //   try {
//   //     await dispatch(deleteProductFromCart({ cartId, productId })).unwrap();
//   //     toast.success("Sản phẩm đã được xóa khỏi giỏ hàng.");
//   //   } catch (error) {
//   //     toast.error("Xóa sản phẩm thất bại.");
//   //   }
//   // };

//   if (cartStatus === "loading") {
//     return <p>Loading...</p>;
//   }

//   if (cartStatus === "failed") {
//     toast.error(`Error: ${cartError}`);
//     return <p>Error: {cartError}</p>;
//   }

//   if (!Array.isArray(carts) || carts.length === 0) {
//     return <p>Giỏ hàng trống</p>;
//   }

//   const groupedMap = new Map<string, CartType>();
//   const groupedCarts: CartType[] = [];
//   const filteredCarts = carts.filter(
//     (cart): cart is CartType =>
//       cart !== null && cart !== undefined && Array.isArray(cart.items)
//   );

//   filteredCarts.forEach((cart) => {
//     cart.items.forEach((item) => {
//       const key = item.product._id;
//       if (key) {
//         if (!groupedMap.has(key)) {
//           groupedMap.set(key, { ...cart, items: [item] });
//         } else {
//           const existingCart = groupedMap.get(key)!;
//           const updatedItems = [...existingCart.items];

//           const itemIndex = updatedItems.findIndex(
//             (i) => i.product._id === item.product._id
//           );

//           if (itemIndex !== -1) {
//             updatedItems[itemIndex] = {
//               ...updatedItems[itemIndex],
//               quantity: updatedItems[itemIndex].quantity + item.quantity,
//               totalItemPrice:
//                 updatedItems[itemIndex].totalItemPrice + item.totalItemPrice,
//             };
//           } else {
//             updatedItems.push(item);
//           }

//           existingCart.items = updatedItems;
//         }
//       }
//     });
//   });

//   groupedMap.forEach((cart) => {
//     groupedCarts.push(cart);
//   });

//   return (
//     <div className="cart-page">
//       {groupedCarts.map((cart) => (
//         <div key={cart._id} className="cart">
//           {cart.items?.map((item) => (
//             <div key={item.product._id} className="cart-item">
//               <h3>{item.product.product_name}</h3>
//               <p>
//                 {item.product.product_price} x{" "}
//                 <input
//                   type="number"
//                   value={itemQuantities[item.product._id] || item.quantity}
//                   onChange={(e) =>
//                     setItemQuantities((prev) => ({
//                       ...prev,
//                       [item.product._id]: Number(e.target.value),
//                     }))
//                   }
//                   onBlur={(e) =>
//                     handleBlur(cart._id, item.product._id, e.target.value)
//                   }
//                   min={1}
//                 />
//               </p>
//               <p>
//                 Total:{" "}
//                 {(item.product.product_price || 0) *
//                   (itemQuantities[item.product._id] || item.quantity)}
//               </p>
//               <Button
//                 onClick={() =>
//                   handleDecreaseQuantity(
//                     cart._id,
//                     item.product._id,
//                     itemQuantities[item.product._id] || item.quantity
//                   )
//                 }
//               >
//                 -1
//               </Button>
//               <Button
//                 onClick={() =>
//                   handleIncreaseQuantity(
//                     cart._id,
//                     item.product._id,
//                     itemQuantities[item.product._id] || item.quantity
//                   )
//                 }
//               >
//                 +1
//               </Button>
//               <Button
//               // onClick={() => handleDeleteProduct(cart._id, item.product._id)}
//               >
//                 Delete
//               </Button>
//             </div>
//           ))}
//         </div>
//       ))}
//       <div className="cart-summary">
//         <p>Total Price: {totalCartPrice}</p>
//         <Button onClick={handleCheckout}>Checkout</Button>
//       </div>
//       <ToastContainer />
//     </div>
//   );
// };

// export default CartPage;
