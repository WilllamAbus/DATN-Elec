// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   deleteCart,
//   fetchCartList,
//   updateCartItem,
//   SelectCart,
// } from "../../../../redux/cart/cartThunk";
// import { AppDispatch, RootState } from "../../../../redux/store";
// import { CartItem, CartType } from "../../../../types/cart/carts";
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
//     console.log("Carts updated:", carts);

//     const newItemQuantities: { [key: string]: number } = {};
//     carts.forEach((cart) => {
//       cart.items.forEach((item) => {
//         newItemQuantities[item.product._id] = item.quantity;
//       });
//     });
//     setItemQuantities(newItemQuantities);
//   }, [carts]);

//   // Tính tổng giá trị giỏ hàng dựa trên trạng thái isSelected
//   useEffect(() => {
//     const total = carts.reduce((total, cart) => {
//       return (
//         total +
//         cart.items.reduce((itemTotal, item) => {
//           // Kiểm tra trạng thái isSelected từ state
//           if (item.isSelected) {
//             // Thay đổi ở đây
//             const quantity = itemQuantities[item.product._id] || item.quantity;
//             return (
//               itemTotal + (item.product.product_price_unit || 0) * quantity
//             );
//           }
//           return itemTotal; // Không tính nếu không được chọn
//         }, 0)
//       );
//     }, 0);
//     setTotalCartPrice(total);
//   }, [carts, itemQuantities]);

//   // Hàm chọn sản phẩm
//   const handleSelectCart = (productId: string, item: CartItem) => {
//     const updatedItem = {
//       productId: item.product._id,
//       isSelected: item.isSelected, // Giữ trạng thái được truyền vào
//     };

//     dispatch(SelectCart({ productId, items: [updatedItem] }))
//       .unwrap()
//       .then((response) => {
//         console.log("Giỏ hàng đã được chọn:", response);
//         toast.success("Giỏ hàng đã được cập nhật thành công!");
//       })
//       .catch((error) => {
//         console.error("Lỗi khi chọn giỏ hàng:", error);
//         toast.error("Lỗi khi cập nhật giỏ hàng.");
//       });
//   };

//   // Hàm xử lý chọn tất cả sản phẩm
//   const handleSelectAll = (isSelected: boolean) => {
//     carts.forEach((cart) => {
//       cart.items.forEach((item) => {
//         // Chỉ cập nhật những sản phẩm có trạng thái isSelected khác với yêu cầu
//         if (item.isSelected !== isSelected) {
//           handleSelectCart(cart._id, { ...item, isSelected });
//         }
//       });
//     });
//   };

//   const handleQuantityChange = async (
//     cartId: string,
//     itemId: string,
//     newQuantity: number
//   ) => {
//     const item = carts
//       .flatMap((cart) => cart.items)
//       .find((i) => i.product._id === itemId);

//     if (item) {
//       const stock = item.inventory.quantityShelf; // Số lượng tồn kho từ `inventory`
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
//       .flatMap((cart) => cart.items)
//       .find((i) => i.product._id === itemId);

//     if (item) {
//       const stock = item.inventory.quantityShelf; // Số lượng tồn kho từ `inventory`

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

//   const handleDeleteProduct = async (cartId: string, productId: string) => {
//     try {
//       await dispatch(deleteCart({ cartId, productId })).unwrap();
//       toast.success("Sản phẩm đã được xóa khỏi giỏ hàng.");
//     } catch (error) {
//       toast.error("Xóa sản phẩm thất bại.");
//     }
//   };

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
//                 updatedItems[itemIndex].totalItemPrice +
//                 item.product.product_price_unit * item.quantity,
//             };
//           } else {
//             // Trường hợp thêm mới sản phẩm vào giỏ hàng
//             updatedItems.push({
//               ...item,
//               totalItemPrice: item.product.product_price_unit * item.quantity,
//             });
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
//     <div className="container lg:col-span-8 border border-gray-200 p-4 rounded-lg shadow-sm bg-white mb-16 mt-16">
//       <div className="grid md:grid-cols-3 gap-4">
//         <div className="md:col-span-2 p-4 rounded-md">
//           <h2 className="text-2xl font-bold text-gray-800">Giỏ hàng</h2>
//           <hr className="border-gray-300 mt-4 mb-8" />
//           <th scope="col" className="p-4">
//             <div className="flex items-center">
//               <input
//                 id="checkbox-all-orders"
//                 type="checkbox"
//                 className="w-4 h-4 text-primary-600 bg-gray-100 rounded border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
//                 onChange={(e) => handleSelectAll(e.target.checked)} // Xử lý chọn tất cả
//                 checked={carts.every((cart) =>
//                   cart.items.every((item) => item.isSelected)
//                 )} // Kiểm tra nếu tất cả sản phẩm được chọn
//               />
//               <label htmlFor="checkbox-all-orders" className="ml-2">
//                 Chọn tất cả
//               </label>
//             </div>
//           </th>

//           <div className="space-y-4">
//             {groupedCarts.map((cart) => (
//               <div
//                 key={`${cart._id}-${cart.items[0].product._id}`}
//                 className="grid bg-white grid-cols-3 items-center gap-4"
//               >
//                 <div className="col-span-2 flex items-center gap-4">
//                   <th scope="col" className="p-4">
//                     <div className="flex items-center">
//                       <input
//                         id={`checkbox-${cart._id}`} // Đảm bảo ID duy nhất cho từng giỏ hàng
//                         type="checkbox"
//                         checked={cart.items.every((item) => item.isSelected)} // Kiểm tra nếu tất cả sản phẩm trong giỏ hàng đã được chọn
//                         onChange={() => {
//                           // Lặp qua từng sản phẩm trong giỏ hàng để cập nhật trạng thái
//                           cart.items.forEach((item) => {
//                             handleSelectCart(cart._id, item); // Gọi hàm handleSelectCart với cart ID và item
//                           });
//                         }}
//                         className="w-4 h-4 text-primary-600 bg-gray-100 rounded border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
//                       />
//                       <label
//                         htmlFor={`checkbox-${cart._id}`}
//                         className="sr-only"
//                       >
//                         checkbox
//                       </label>
//                     </div>
//                   </th>

//                   <div className="w-24 h-24 shrink-0 border bg-white p-2 rounded-md">
//                     <img
//                       src={
//                         cart.items[0].product.image[0] || "default-image-url"
//                       }
//                       alt={`product ${cart.items[0].product.product_name}`}
//                       className="w-full h-full object-contain"
//                     />
//                   </div>

//                   <div>
//                     <h3 className="text-base font-bold text-gray-800">
//                       {cart.items[0].product.product_name}
//                     </h3>
//                     <h6
//                       onClick={() =>
//                         handleDeleteProduct(cart._id, cart.items[0].product._id)
//                       }
//                       className="text-xs text-red-500 cursor-pointer mt-0.5"
//                     >
//                       Xóa
//                     </h6>

//                     <div className="flex gap-4 mt-4">
//                       <button
//                         type="button"
//                         className="flex items-center px-2.5 py-1.5 border border-gray-300 text-gray-800 text-xs outline-none bg-transparent rounded-md"
//                       >
//                         <h5 className="text-gray-800 font-semibold">
//                           {cart.items[0].product.weight_g} kg
//                         </h5>
//                       </button>

//                       <div className="flex items-center gap-2">
//                         <button
//                           type="button"
//                           className="flex items-center justify-center w-8 h-8 border border-gray-300 text-gray-800 text-xs outline-none bg-transparent rounded-md"
//                           onClick={() =>
//                             handleDecreaseQuantity(
//                               cart._id,
//                               cart.items[0].product._id,
//                               itemQuantities[cart.items[0].product._id] ||
//                                 cart.items[0].quantity
//                             )
//                           }
//                         >
//                           <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             className="w-3 fill-current"
//                             viewBox="0 0 124 124"
//                           >
//                             <path d="M112 50H12c-6.6 0-10.8-1.8-10.8-6.5S5.4 37 12 37h100c6.6 0 10.8 1.8 10.8 6.5S118.6 50 112 50z" />
//                           </svg>
//                         </button>

//                         <input
//                           type="text"
//                           className="w-12 text-center border border-gray-300 text-gray-800 text-xs rounded-md"
//                           value={
//                             itemQuantities[cart.items[0].product._id] ||
//                             cart.items[0].quantity
//                           }
//                           onChange={(e) => {
//                             const newQuantity = Number(e.target.value);
//                             if (!isNaN(newQuantity) && newQuantity >= 1) {
//                               setItemQuantities((prevQuantities) => ({
//                                 ...prevQuantities,
//                                 [cart.items[0].product._id]: newQuantity,
//                               }));
//                             }
//                           }}
//                           onBlur={(e) =>
//                             handleBlur(
//                               cart._id,
//                               cart.items[0].product._id,
//                               e.target.value
//                             )
//                           }
//                         />

//                         <button
//                           type="button"
//                           className="flex items-center justify-center w-8 h-8 border border-gray-300 text-gray-800 text-xs outline-none bg-transparent rounded-md"
//                           onClick={() =>
//                             handleIncreaseQuantity(
//                               cart._id,
//                               cart.items[0].product._id,
//                               itemQuantities[cart.items[0].product._id] ||
//                                 cart.items[0].quantity
//                             )
//                           }
//                         >
//                           <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             className="w-3 fill-current"
//                             viewBox="0 0 42 42"
//                           >
//                             <path d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z" />
//                           </svg>
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="ml-auto">
//                   <h4 className="text-base font-bold text-gray-800">
//                     {cart.items[0].product.product_price_unit.toLocaleString(
//                       "vi-VN",
//                       { style: "currency", currency: "VND" }
//                     )}{" "}
//                   </h4>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="p-4 rounded-md bg-gray-50">
//           <h2 className="text-xl font-bold text-gray-800">Tổng cộng</h2>
//           <hr className="border-gray-300 mt-4 mb-8" />
//           <h3 className="text-gray-800">Danh sách sản phẩm:</h3>
//           {groupedCarts.map((cart) => (
//             <div key={cart._id} className="flex justify-between mt-2">
//               <span className="text-gray-800">
//                 {cart.items[0].product.product_name} x{" "}
//                 {itemQuantities[cart.items[0].product._id] ||
//                   cart.items[0].quantity}
//               </span>
//             </div>
//           ))}
//           <div className="space-y-4">
//             <div className="flex justify-between items-center">
//               <p className="text-gray-800">Tạm tính:</p>
//               <p className="font-bold text-gray-800">
//                 {totalCartPrice.toLocaleString("vi-VN", {
//                   style: "currency",
//                   currency: "VND",
//                 })}
//               </p>
//             </div>

//             <div className="flex justify-between items-center">
//               <p className="text-gray-800">Phí vận chuyển:</p>
//               <p className="font-bold text-gray-800">50.000₫</p>
//             </div>
//           </div>

//           <hr className="border-gray-300 mt-4 mb-8" />

//           <div className="flex justify-between items-center">
//             <p className="text-lg font-bold text-gray-800">Tổng cộng:</p>
//             <p className="text-xl font-bold text-red-600">
//               {(totalCartPrice + 50000).toLocaleString("vi-VN", {
//                 style: "currency",
//                 currency: "VND",
//               })}
//             </p>
//           </div>
//           <div className="mt-8 space-y-2">
//             <Button
//               onClick={handleCheckout}
//               className="w-full bg-blue-600 font-semibold text-white hover:bg-primary-dark focus:ring-primary-light"
//               disabled={!groupedCarts.length}
//             >
//               Thanh toán
//             </Button>
//             <Button className="w-full bg-blue-600 font-semibold text-white hover:bg-primary-dark focus:ring-primary-light">
//               Tiếp tục mua sắm
//             </Button>
//           </div>
//         </div>
//       </div>

//       <ToastContainer />
//     </div>
//   );
// };

// export default CartPage;
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCart,
  fetchCartList,
  updateCartItem,
  SelectCart,
} from "../../../../redux/cart/cartThunk";
import { AppDispatch, RootState } from "../../../../redux/store";
import { CartItem, CartType } from "../../../../types/cart/carts";
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
  const [loading, setLoading] = useState(false);

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
    const updatedItemQuantities: { [key: string]: number } = {};
    carts.forEach((cart) => {
      cart.items.forEach((item) => {
        updatedItemQuantities[item.product._id] = item.quantity;
      });
    });
    setItemQuantities(updatedItemQuantities);
  }, [carts]);

  useEffect(() => {
    const total = carts.reduce((total, cart) => {
      return (
        total +
        cart.items.reduce((itemTotal, item) => {
          if (item.isSelected) {
            const quantity = itemQuantities[item.product._id] || item.quantity;
            return (
              itemTotal + (item.product.product_price_unit || 0) * quantity
            );
          }
          return itemTotal;
        }, 0)
      );
    }, 0);
    setTotalCartPrice(total);
  }, [carts, itemQuantities]);

  const handleSelectCart = async (productId: string, item: CartItem) => {
    const updatedItem = {
      productId: item.product._id,
      isSelected: !item.isSelected,
    };
    toast.dismiss();
    setLoading(true);
    try {
      await dispatch(SelectCart({ productId, items: [updatedItem] })).unwrap();
    } catch (error) {
      console.error("Lỗi khi chọn giỏ hàng:", error);
      toast.error("Lỗi khi cập nhật giỏ hàng.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = async (isSelected: boolean) => {
    setLoading(true);
    try {
      for (const cart of carts) {
        for (const item of cart.items) {
          if (item.isSelected !== isSelected) {
            await handleSelectCart(cart._id, { ...item, isSelected });
          }
        }
      }
    } catch (error) {
      toast.error("Lỗi khi chọn tất cả sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (
    cartId: string,
    itemId: string,
    newQuantity: number
  ) => {
    const item = carts
      .flatMap((cart) => cart.items)
      .find((i) => i.product._id === itemId);

    if (item) {
      const stock = item.inventory.quantityShelf; // Số lượng tồn kho từ `inventory`
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
    navigate(`/checkout/${carts[0]._id}`, {
      state: { groupedCarts, totalCartPrice },
    });
  };
  //   <Button
  //   to={`/admin/listDetailOrder/${carts[0]._id}`}
  //   className="w-full bg-blue-600 font-semibold text-white hover:bg-primary-dark focus:ring-primary-light"
  // >
  //   Thanh toán
  // </Button>
  const handleDeleteProduct = async (cartId: string, productId: string) => {
    setLoading(true); // Bắt đầu loading
    try {
      await dispatch(deleteCart({ cartId, productId })).unwrap();
      toast.success("Sản phẩm đã được xóa khỏi giỏ hàng.");
    } catch (error) {
      toast.error("Xóa sản phẩm thất bại.");
    } finally {
      setLoading(false); // Dừng loading sau khi thực hiện xong
    }
  };

  // if (cartStatus === "loading") {
  //   return <p>Loading...</p>;
  // }

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
    (cart) => cart !== null && cart !== undefined && Array.isArray(cart.items)
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

  return (
    <div className="container lg:col-span-8 border border-gray-200 p-4 rounded-lg shadow-sm bg-white mb-16 mt-16">
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 p-4 rounded-md">
          <h2 className="text-2xl font-bold text-gray-800">Giỏ hàng</h2>
          <hr className="border-gray-300 mt-4 mb-8" />
          <th scope="col" className="p-4">
            <div className="flex items-center">
              <input
                id="checkbox-all-orders"
                type="checkbox"
                className="w-4 h-4 text-primary-600 bg-gray-100 rounded border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                onChange={(e) => handleSelectAll(e.target.checked)} // Xử lý chọn tất cả
                checked={carts.every((cart) =>
                  cart.items.every((item) => item.isSelected)
                )}
              />
              <label htmlFor="checkbox-all-orders" className="ml-2">
                Chọn tất cả
              </label>
            </div>
          </th>

          <div className="space-y-4">
            {groupedCarts.map((cart) => (
              <div
                key={`${cart._id}-${cart.items[0].product._id}`}
                className="grid bg-white grid-cols-3 items-center gap-4"
              >
                <div className="col-span-2 flex items-center gap-4">
                  <th scope="col" className="p-4">
                    <div className="flex items-center">
                      <input
                        id={`checkbox-${cart._id}`} // Đảm bảo ID duy nhất cho từng giỏ hàng
                        type="checkbox"
                        checked={cart.items.every((item) => item.isSelected)}
                        onChange={() => {
                          cart.items.forEach((item) => {
                            handleSelectCart(cart._id, item);
                          });
                        }}
                        className="w-4 h-4 text-primary-600 bg-gray-100 rounded border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label
                        htmlFor={`checkbox-${cart._id}`}
                        className="sr-only"
                      >
                        checkbox
                      </label>
                    </div>
                  </th>

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
                      className={`text-xs text-red-500 cursor-pointer mt-0.5 ${
                        loading ? "opacity-50" : ""
                      }`}
                    >
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
                              setItemQuantities((prev) => ({
                                ...prev,
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
                      "vi-VN",
                      { style: "currency", currency: "VND" }
                    )}
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
              disabled={!groupedCarts.length}
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
