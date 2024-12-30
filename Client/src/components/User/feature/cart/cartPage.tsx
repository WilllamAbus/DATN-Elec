import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCart,
  fetchCartList,
  updateCartItem,
  SelectCart,
} from "../../../../redux/cart/cartThunk";
import { AppDispatch, RootState } from "../../../../redux/store";
import { CartType } from "../../../../types/cart/carts";
import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button, Checkbox } from "@nextui-org/react";
import CartSummary from "./hook/CartSumma";
import Cartauction from "./hook/Cartauction";

const CartPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const carts = useSelector((state: RootState) => state.cart.carts);
  const cartauction = useSelector((state: RootState) => state.cart.carts);
  const cartStatus = useSelector((state: RootState) => state.cart.status);
  const cartError = useSelector((state: RootState) => state.cart.error);
  const [loading, setLoading] = useState(false);
  const userRole = useSelector(
    (state: RootState) => state.auth.profile?.roles || []
  );
  const userProfile = useSelector(
    (state: RootState) => state.auth.login.isLoggedIn
  );
  const [activeTab, setActiveTab] = useState("regular");
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };
  const [itemQuantities, setItemQuantities] = useState<{
    [key: string]: number;
  }>({});
  const [totalAuctionPrice, setTotalAuctionPrice] = useState(0);
  const [totalCartPrice, setTotalCartPrice] = useState(0);
  // useEffect(() => {
  //   dispatch(fetchCartList());
  // }, [dispatch]);
  if (!userProfile) {
    navigate("/login");
    return null;
  }
  useEffect(() => {
    const updatedItemQuantities: { [key: string]: number } = {};

    if (Array.isArray(carts)) {
      carts.forEach((cart) => {
        if (Array.isArray(cart.items)) {
          cart.items.forEach((item) => {
            updatedItemQuantities[item.product._id] = item.quantity;
          });
        } else {
          console.warn("Cart items are not in an array format:", cart.items);
        }
      });
      setItemQuantities(updatedItemQuantities);
    } else {
      console.error("Expected carts to be an array but received:", carts);
    }
  }, [carts]);

  // useEffect(() => {
  //   const total = carts.reduce((total, cart) => {
  //     return (
  //       total +
  //       cart.itemAuction.reduce((itemTotal, item) => {
  //         if (item.isSelected) {
  //           const quantity =
  //             itemQuantities[item.auctionPricingRange?.product_randBib?._id] ||
  //             item.quantity;
  //           return itemTotal + (item.auctionWinner?.bidPrice || 0) * quantity;
  //         }
  //         return itemTotal;
  //       }, 0)
  //     );
  //   }, 0);
  //   setTotalAuctionPrice(total);
  // }, [carts, itemQuantities]);
  useEffect(() => {
    const total = carts.reduce((total, cart) => {
      return (
        total +
        cart.itemAuction.reduce((itemTotal, item) => {
          const quantity =
            itemQuantities[item.auctionPricingRange?.product_randBib?._id] ||
            item.quantity;
          return itemTotal + (item.auctionWinner?.bidPrice || 0) * quantity;
        }, 0)
      );
    }, 0);
    setTotalAuctionPrice(total);
  }, [carts, itemQuantities]);

  useEffect(() => {
    const total = carts.reduce((total, cart) => {
      return (
        total +
        cart.items.reduce((itemTotal, item) => {
          if (item.isSelected) {
            const quantity = itemQuantities[item.product._id] || item.quantity;
            return (
              itemTotal + (item.productVariant.variant_price || 0) * quantity
            );
          }
          return itemTotal;
        }, 0)
      );
    }, 0);
    setTotalCartPrice(total);
  }, [carts, itemQuantities]);

  const handleSelectCart = async (productId: string, cart: CartType) => {
    const updatedItems = cart.items.map((cartItem) => ({
      productId: cartItem.product._id,
      variantId: cartItem.productVariant._id,
      isSelected: !cartItem.isSelected,
    }));

    toast.dismiss();
    setLoading(true);
    try {
      await dispatch(SelectCart({ productId, items: updatedItems })).unwrap();

      await dispatch(fetchCartList());
    } catch (error) {
      console.error("Lỗi khi chọn giỏ hàng:", error);
      toast.error("Lỗi khi cập nhật giỏ hàng.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = async (isSelected: boolean, cartId: string) => {
    setLoading(true);
    try {
      await dispatch(SelectCart({ selectAll: isSelected, cartId })).unwrap();

      await dispatch(fetchCartList());
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
      const stock = item.inventory.quantityShelf;

      const maxQuantity = Math.min(99, stock);
      if (newQuantity > maxQuantity) {
        toast.dismiss();
        toast.error(
          `Số lượng không được vượt quá ${maxQuantity} sản phẩm có sẵn.`
        );
        setItemQuantities((prevQuantities) => ({
          ...prevQuantities,
          [itemId]: item.quantity,
        }));
        return;
      }
    }

    const validQuantity = Math.max(1, newQuantity);
    try {
      const variantId = item?.productVariant._id;
      if (!variantId) {
        throw new Error("Thiếu biến thể sản phẩm.");
      }

      await dispatch(
        updateCartItem({
          cartId,
          itemId,
          variantId,
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
    navigate(`/checkout/${carts[0]._id}`, {});
  };
  const handleCheckoutAuction = () => {
    navigate(`/checkAuction/${carts[0]._id}`, {});
  };

  const handleDeleteProduct = async (
    cartId: string,
    productId?: string,
    productVariantId?: string
  ) => {
    setLoading(true);
    try {
      await dispatch(
        deleteCart({ cartId, productId, productVariantId })
      ).unwrap();
      toast.success("Sản phẩm đã được xóa khỏi giỏ hàng.");
    } catch (error) {
      toast.error("Xóa sản phẩm thất bại.");
    } finally {
      setLoading(false);
    }
  };
  if (cartStatus === "failed") {
    toast.error(`Error: ${cartError}`);
    return <p>Error: {cartError}</p>;
  }

  if (!Array.isArray(carts)) {
    return <p>Dữ liệu giỏ hàng không hợp lệ</p>;
  }

  const groupedMap = new Map<string, CartType>();
  const groupedCarts: CartType[] = [];
  const filteredCarts = carts.filter(
    (cart) => cart !== null && cart !== undefined && Array.isArray(cart.items)
  );

  filteredCarts.forEach((cart) => {
    cart.items.forEach((item) => {
      const key = `${item.product._id}-${item.productVariant._id}`; // Nhóm theo cả productId và variantId

      if (!groupedMap.has(key)) {
        groupedMap.set(key, { ...cart, items: [item] });
      } else {
        const existingCart = groupedMap.get(key)!;
        const updatedItems = [...existingCart.items];

        const itemIndex = updatedItems.findIndex(
          (i) =>
            i.product._id === item.product._id &&
            i.productVariant._id === item.productVariant._id
        );

        if (itemIndex !== -1) {
          updatedItems[itemIndex] = {
            ...updatedItems[itemIndex],
            quantity: updatedItems[itemIndex].quantity + item.quantity,
            totalItemPrice:
              updatedItems[itemIndex].totalItemPrice +
              item.productVariant.variant_price * item.quantity,
          };
        } else {
          updatedItems.push({
            ...item,
            totalItemPrice: item.productVariant.variant_price * item.quantity,
          });
        }

        existingCart.items = updatedItems;
      }
    });
  });

  groupedMap.forEach((cart) => {
    groupedCarts.push(cart);
  });
  const [timeLeft, setTimeLeft] = useState<string>(""); // Thời gian còn lại
  const [, setStatus] = useState<string>(""); // Trạng thái đấu giá

  useEffect(() => {
    // Kiểm tra nếu cartauction và itemAuction có dữ liệu hợp lệ
    if (
      cartauction.length > 0 &&
      cartauction[0].itemAuction.length > 0 &&
      cartauction[0].itemAuction[0].auctionStartTime &&
      cartauction[0].itemAuction[0].auctionEndTime
    ) {
      const startTime = new Date(
        cartauction[0].itemAuction[0].auctionStartTime
      ).getTime();
      const endTime = new Date(
        cartauction[0].itemAuction[0].auctionEndTime
      ).getTime();

      // Hàm cập nhật thời gian còn lại
      const updateTimeLeft = () => {
        const now = new Date().getTime();
        const difference = endTime - now;

        if (difference <= 0) {
          // Nếu hết thời gian, dừng lại và cập nhật trạng thái
          clearInterval(interval);
          setTimeLeft("Hết thời gian!");
          setStatus("Đấu giá đã kết thúc.");
        } else {
          // Tính thời gian còn lại
          const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((difference / (1000 * 60)) % 60);
          const seconds = Math.floor((difference / 1000) % 60);

          setTimeLeft(
            `${hours.toString().padStart(2, "0")}h:${minutes
              .toString()
              .padStart(2, "0")}m:${seconds.toString().padStart(2, "0")}s`
          );
        }

        // Kiểm tra trạng thái đấu giá
        if (now < startTime) {
          setStatus("Đấu giá chưa bắt đầu.");
        } else if (now >= startTime && now <= endTime) {
          setStatus("Đấu giá đang diễn ra.");
        }
      };

      // Cập nhật mỗi giây
      const interval = setInterval(updateTimeLeft, 1000);

      // Dọn dẹp interval khi component bị unmount hoặc khi có thay đổi dữ liệu đấu giá
      return () => clearInterval(interval);
    } else {
      // Nếu không có thông tin đấu giá hợp lệ
      setTimeLeft("Không có dữ liệu đấu giá.");
      setStatus("Không có thông tin đấu giá.");
    }
  }, [cartauction]); // Thêm `cartauction` vào dependency array

  if (!Array.isArray(carts)) {
    return <p>Dữ liệu giỏ hàng không hợp lệ</p>;
  }

  return (
    <div className="min-h-[calc(71vh-10rem)] container lg:col-span-8 border border-gray-200 p-4 rounded-lg shadow-sm bg-white mb-16 mt-16">
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 p-4 rounded-md">
          <div className="flex space-x-4">
            <Button
              onClick={() => handleTabChange("regular")}
              className={`${
                activeTab === "regular"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              Giỏ hàng thông thường
            </Button>
            <Button
              onClick={() => handleTabChange("auction")}
              className={`${
                activeTab === "auction"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              Giỏ hàng Đấu giá
            </Button>
          </div>
          {activeTab === "regular" && (
            <>
              {groupedCarts.length === 0 ? (
                <div className="text-center mt-10">
                  <div className="flex justify-center">
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png"
                      alt="Giỏ hàng trống"
                      className="w-64 h-64 object-cover"
                    />
                  </div>
                  <button
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => navigate("/")}
                  >
                    Tiếp tục mua sắm
                  </button>
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Giỏ hàng thông thường
                  </h2>
                  <hr className="border-gray-300 mt-4 mb-8" />

                  <hr className="border-gray-300 mt-4 mb-8" />
                  {groupedCarts.length > 0 && (
                    <div className="flex ml-4 items-center">
                      <Checkbox
                        id="checkbox-all-orders"
                        isSelected={carts.every((cart) =>
                          cart.items.every((item) => item.isSelected)
                        )}
                        onChange={(e) =>
                          handleSelectAll(e.target.checked, carts[0]._id)
                        }
                        size="sm"
                        color="primary"
                        className="mr-2"
                      >
                        Chọn tất cả
                      </Checkbox>

                      <Button
                        onClick={() => handleDeleteProduct(carts[0]._id)}
                        disabled={loading}
                        className="btn btn-danger"
                      >
                        <i className="iconify mdi--delete w-5 h-5 text-red-600 transition duration-75 dark:text-red-400 group-hover:text-red-800 dark:group-hover:text-white"></i>
                        Xóa toàn bộ
                      </Button>
                    </div>
                  )}
                  <div className="space-y-4 mt-4">
                    {groupedCarts.map((cart, index) => (
                      <div
                        key={index}
                        // key={`${cart._id}-${cart.items[0].product._id}`}
                        className="bg-white p-4 rounded-md shadow-sm"
                      >
                        <div className="flex flex-wrap items-center gap-4">
                          <div className="flex items-center gap-4 w-full md:w-3/4">
                            <Checkbox
                              id={`checkbox-${cart._id}`}
                              isSelected={cart.items.every(
                                (item) => item.isSelected
                              )}
                              onChange={() => handleSelectCart(cart._id, cart)}
                              size="sm"
                              color="primary"
                              className="mr-2"
                            />

                            <div className="w-24 h-24 shrink-0 border bg-white p-2 rounded-md">
                              <img
                                src={
                                  cart.items[0]?.productVariant?.image?.[0]
                                    ?.image?.[0] ||
                                  "https://img.lovepik.com/free-png/20220126/lovepik-404-page-not-accessible-png-image_401803272_wh1200.png"
                                }
                                alt={`product ${
                                  cart.items[0]?.productVariant?.variant_name ||
                                  "Unknown"
                                }`}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div className="flex flex-col gap-2 w-full">
                              <h3 className="text-base font-bold text-gray-800">
                                {cart.items[0].productVariant.variant_name}
                              </h3>
                              <h6
                                onClick={() =>
                                  handleDeleteProduct(
                                    cart._id,
                                    cart.items[0].product._id,
                                    cart.items[0].productVariant._id
                                  )
                                }
                                className={`text-xs text-red-500 cursor-pointer mt-0.5 ${
                                  loading ? "opacity-50" : ""
                                }`}
                              >
                                Xóa
                              </h6>

                              <div className="flex flex-wrap gap-4 mt-4">
                                <button
                                  type="button"
                                  className="flex items-center px-2.5 py-1.5 border border-gray-300 text-gray-800 text-xs outline-none bg-transparent rounded-md"
                                >
                                  <h5 className="text-gray-800 font-semibold">
                                    {cart.items[0].productVariant.ram?.name}
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
                                        itemQuantities[
                                          cart.items[0].product._id
                                        ] || cart.items[0].quantity
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
                                      itemQuantities[
                                        cart.items[0].product._id
                                      ] || cart.items[0].quantity
                                    }
                                    onChange={(e) => {
                                      const newQuantity = Number(
                                        e.target.value
                                      );
                                      if (
                                        !isNaN(newQuantity) &&
                                        newQuantity >= 1 &&
                                        newQuantity <= 99
                                      ) {
                                        setItemQuantities((prev) => ({
                                          ...prev,
                                          [cart.items[0].product._id]:
                                            newQuantity,
                                        }));
                                      } else if (newQuantity > 99) {
                                        toast.dismiss();
                                        toast.error(
                                          "Số lượng không được vượt quá 99."
                                        );
                                        setItemQuantities((prev) => ({
                                          ...prev,
                                          [cart.items[0].product._id]: 99,
                                        }));
                                      }
                                    }}
                                    onBlur={(e) =>
                                      handleQuantityChange(
                                        cart._id,
                                        cart.items[0].product._id,
                                        Number(e.target.value)
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
                                        itemQuantities[
                                          cart.items[0].product._id
                                        ] || cart.items[0].quantity
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

                          <div className="ml-auto mt-4 md:mt-0">
                            <h4 className="text-base font-bold text-gray-800">
                              {cart.items.length > 0 &&
                              cart.items[0].productVariant?.variant_price
                                ? cart.items[0].productVariant.variant_price.toLocaleString(
                                    "vi-VN",
                                    {
                                      style: "currency",
                                      currency: "VND",
                                    }
                                  )
                                : "Giá chưa được cập nhật"}
                            </h4>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
          {activeTab === "auction" && (
            <>
              {cartauction?.[0]?.itemAuction?.length === 0 ? (
                <div className="text-center mt-10">
                  <div className="flex justify-center">
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png"
                      alt="Giỏ hàng trống"
                      className="w-64 h-64 object-cover"
                    />
                  </div>
                  <button
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => navigate("/")}
                  >
                    Tiếp tục mua sắm
                  </button>
                </div>
              ) : (
                <div className="container mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
                  <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                    Giỏ Hàng Đấu Giá
                  </h1>
                  {cartauction.length > 0 ? (
                    cartauction.map((auction, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-lg shadow-md p-4 mb-4 border border-gray-200"
                      >
                        <div className="flex flex-wrap items-center gap-6">
                          {/* Hình ảnh sản phẩm */}
                          <div className="w-24 h-24 flex-shrink-0 border bg-gray-100 p-2 rounded-md">
                            <img
                              src={
                                auction?.itemAuction?.[0]?.auctionPricingRange
                                  ?.product_randBib?.image?.[0]
                              }
                              alt="Sản phẩm"
                              className="w-full h-full object-contain"
                            />
                          </div>

                          {/* Thông tin sản phẩm */}
                          <div className="flex flex-col flex-grow">
                            <h3 className="text-lg font-semibold text-gray-800">
                              {
                                auction?.itemAuction?.[0]?.auctionPricingRange
                                  ?.product_randBib?.product_name
                              }
                            </h3>
                            <p className="text-sm text-gray-600">
                              {`ID sản phẩm: ${
                                auction?.itemAuction?.[0]?._id ||
                                "Không xác định"
                              }`}
                            </p>

                            {/* Thời gian đấu giá */}
                            {auction.itemAuction.length > 0 && (
                              <div className="mt-2 flex items-center gap-2">
                                <div className="flex items-center gap-1 text-sm text-gray-700">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-red-500"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 9V4a1 1 0 112 0v5a1 1 0 01-1 1H4a1 1 0 110-2h5z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  <span className="font-medium">
                                    {timeLeft}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Giá trị trúng đấu giá */}
                          <div className="text-right">
                            <h4 className="text-lg font-bold text-gray-800">
                              {auction.itemAuction.length > 0 &&
                              auction.itemAuction[0].auctionWinner?.bidPrice
                                ? auction.itemAuction[0].auctionWinner?.bidPrice.toLocaleString(
                                    "vi-VN",
                                    {
                                      style: "currency",
                                      currency: "VND",
                                    }
                                  )
                                : "Giá chưa được cập nhật"}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {`Người chiến thắng: ${
                                auction?.itemAuction?.[0]?.auctionWinner?.user
                                  .name || "Ẩn danh"
                              }`}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 bg-gray-100 rounded-lg shadow-md">
                      <h2 className="text-xl font-semibold text-gray-700">
                        Không có đơn hàng nào
                      </h2>
                      <p className="text-gray-500">
                        Bạn chưa có sản phẩm nào trúng đấu giá. Hãy tham gia
                        thêm nhiều phiên đấu giá để tìm cơ hội sở hữu sản phẩm
                        mong muốn!
                      </p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
        {activeTab === "regular" && (
          <CartSummary
            groupedCarts={groupedCarts}
            totalCartPrice={totalCartPrice}
            itemQuantities={itemQuantities}
            handleCheckout={handleCheckout}
            userRole={userRole}
            activeTab={activeTab}
          />
        )}

        {activeTab === "auction" && (
          <Cartauction
            cartauction={cartauction}
            totalAuctionPrice={totalAuctionPrice}
            itemQuantities={itemQuantities}
            handleCheckoutAuction={handleCheckoutAuction}
            userRole={userRole}
            activeTab={activeTab}
          />
        )}
        {/* {activeTab === "regular" && (
          <div>
            {groupedCarts.length > 0 && (
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
                    <p className="font-bold text-gray-800">
                      Miễn phí giao hàng
                    </p>
                  </div>
                </div>

                <hr className="border-gray-300 mt-4 mb-8" />

                <div className="flex justify-between items-center">
                  <p className="text-lg font-bold text-gray-800">Tổng cộng:</p>
                  <p className="text-xl font-bold text-red-600">
                    {totalCartPrice.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </p>
                </div>

                <div className="mt-8 space-y-2">
                  <Button
                    onClick={handleCheckout}
                    className="w-full bg-blue-600 font-semibold text-white hover:bg-primary-dark focus:ring-primary-light"
                    isDisabled={
                      userRole.includes("admin") ||
                      !groupedCarts.some((cart) =>
                        cart.items.some((item) => item.isSelected)
                      )
                    }
                  >
                    Thanh toán
                  </Button>

                  <Button className="w-full bg-blue-600 font-semibold text-white hover:bg-primary-dark focus:ring-primary-light">
                    Tiếp tục mua sắm
                  </Button>
                </div>
              </div>
            )}
          </div>
        )} */}
        {/* {activeTab === "auction" && (
          <div>
            {groupedCarts.length > 0 && (
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
                    <p className="font-bold text-gray-800">
                      Miễn phí giao hàng
                    </p>
                  </div>
                </div>

                <hr className="border-gray-300 mt-4 mb-8" />

                <div className="flex justify-between items-center">
                  <p className="text-lg font-bold text-gray-800">Tổng cộng:</p>
                  <p className="text-xl font-bold text-red-600">
                    {totalCartPrice.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </p>
                </div>

                <div className="mt-8 space-y-2">
                  <Button
                    onClick={handleCheckout}
                    className="w-full bg-blue-600 font-semibold text-white hover:bg-primary-dark focus:ring-primary-light"
                    isDisabled={
                      userRole.includes("admin") ||
                      !groupedCarts.some((cart) =>
                        cart.items.some((item) => item.isSelected)
                      )
                    }
                  >
                    Thanh toán
                  </Button>

                  <Button className="w-full bg-blue-600 font-semibold text-white hover:bg-primary-dark focus:ring-primary-light">
                    Tiếp tục mua sắm
                  </Button>
                </div>
              </div>
            )}
          </div>
        )} */}
        <ToastContainer />
      </div>
    </div>
  );
};

export default CartPage;
