import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchCartList,
  addProductToCart,
  fetchCartById,
  updateCartItem,
  deleteCart,
  SelectCart,
  CheckVoucherThunk,
} from "./cartThunk";
import { CartItem, CartType } from "../../types/cart/carts";

interface CartState {
  carts: CartType[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: CartState = {
  carts: [],
  status: "idle",
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    updateItemQuantity(
      state,
      action: PayloadAction<{
        cartId: string;
        itemId: string;
        quantity: number;
        selected?: boolean;
      }>
    ) {
      const { cartId, itemId, quantity, selected } = action.payload;

      const cartIndex = state.carts.findIndex((cart) => cart._id === cartId);
      if (cartIndex !== -1) {
        const itemIndex = state.carts[cartIndex].items.findIndex(
          (item) => item._id === itemId
        );
        if (itemIndex !== -1) {
          state.carts[cartIndex].items[itemIndex].quantity = quantity;
          if (selected !== undefined) {
            state.carts[cartIndex].items[itemIndex].isSelected = selected;
          }
          state.carts[cartIndex].items[itemIndex].totalItemPrice =
            quantity *
            state.carts[cartIndex].items[itemIndex].productVariant
              .variant_price;

          // Update total price of the cart
          state.carts[cartIndex].totalPrice = state.carts[
            cartIndex
          ].items.reduce((total, item) => total + item.totalItemPrice, 0);
        }
      }
    },
    toggleSelectCartItem(
      state,
      action: PayloadAction<{ cartId: string; itemId: string }>
    ) {
      const { cartId, itemId } = action.payload;

      const cartIndex = state.carts.findIndex((cart) => cart._id === cartId);
      if (cartIndex !== -1) {
        const itemIndex = state.carts[cartIndex].items.findIndex(
          (item) => item._id === itemId
        );
        if (itemIndex !== -1) {
          state.carts[cartIndex].items[itemIndex].isSelected =
            !state.carts[cartIndex].items[itemIndex].isSelected;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchCartList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCartList.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log("Fetched carts:", action.payload.carts); // Kiểm tra dữ liệu được trả về
        state.carts = action.payload.carts; // Cập nhật với giỏ hàng từ payload
      })

      .addCase(fetchCartList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Cập nhật giỏ hàng thất bại";
      })
      .addCase(addProductToCart.fulfilled, (state, action) => {
        const newCart = action.payload;
        const existingCartIndex = state.carts.findIndex(
          (cart) => cart._id === newCart._id
        );

        if (existingCartIndex >= 0) {
          state.carts[existingCartIndex] = newCart;
        } else {
          state.carts.push(newCart);
        }
      })

      .addCase(updateCartItem.fulfilled, (state, action) => {
        const { cartId, itemId, quantity, isSelected } = action.payload;

        const cartIndex = state.carts.findIndex((cart) => cart._id === cartId);

        if (cartIndex !== -1) {
          const itemIndex = state.carts[cartIndex].items.findIndex(
            (item) => item._id === itemId
          );
          if (itemIndex !== -1) {
            state.carts[cartIndex].items[itemIndex].quantity = quantity;
            if (isSelected !== undefined) {
              state.carts[cartIndex].items[itemIndex].isSelected = isSelected;
            }
            state.carts[cartIndex].items[itemIndex].totalItemPrice =
              quantity *
              state.carts[cartIndex].items[itemIndex].productVariant
                .variant_price;

            // Update total price of the cart
            state.carts[cartIndex].totalPrice = state.carts[
              cartIndex
            ].items.reduce((total, item) => total + item.totalItemPrice, 0);
          }
        }
      })
      .addCase(fetchCartById.pending, (state) => {
        state.status = "loading";
        state.error = null;
        console.log("Fetching cart by ID: loading", state); // Log trạng thái loading
      })
      .addCase(fetchCartById.fulfilled, (state, action) => {
        state.status = "succeeded"; // Change status to succeeded
        console.log("Fetching cart by ID: succeeded", action.payload); // Log the action payload

        if (action.payload) {
          // Replace the carts array with the new cart data
          state.carts = [action.payload]; // Use this if you only expect one cart
        } else {
          console.error("Payload is undefined"); // Log if payload is not valid
        }
      })

      .addCase(fetchCartById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string; // Tin nhắn lỗi từ thunk
        console.log("Fetching cart by ID: failed", action.payload); // Log khi thất bại
      })

      .addCase(deleteCart.pending, (state) => {
        state.status = "loading";
      })

      .addCase(deleteCart.fulfilled, (state, action) => {
        const { cartId, productId, productVariantId } = action.payload;
        const cart = state.carts.find((cart) => cart._id === cartId);

        if (cart) {
          if (productId) {
            cart.items = cart.items.filter((item) => {
              if (productVariantId) {
                return (
                  item.product._id !== productId ||
                  item.productVariant._id !== productVariantId
                );
              }
              return item.product._id !== productId;
            });
          } else {
            cart.items = [];
          }

          cart.totalPrice = cart.items.reduce(
            (total, item) => total + item.totalItemPrice,
            0
          );
        }
      })
      .addCase(deleteCart.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.error.message || "Failed to delete product from cart";
      })
      // Thêm trường hợp cho SelectCart
      .addCase(SelectCart.pending, (state) => {
        state.status = "loading"; // Khi bắt đầu xử lý
      })

      // .addCase(SelectCart.fulfilled, (state, action) => {
      //   console.log("action payload:", action.payload);
      //   const { allItems } = action.payload;

      //   // Duyệt qua tất cả các phần tử được cập nhật trong allItems
      //   allItems.forEach((updatedItem: CartItem) => {
      //     // Tìm giỏ hàng chứa sản phẩm được cập nhật
      //     const cart = state.carts.find((cart) =>
      //       cart.items.some(
      //         (item) => item.product._id === updatedItem.product._id
      //       )
      //     );

      //     if (cart) {
      //       // Cập nhật trạng thái của sản phẩm trong giỏ hàng
      //       cart.items = cart.items.map((item) =>
      //         item.product._id === updatedItem.product._id
      //           ? { ...item, isSelected: updatedItem.isSelected }
      //           : item
      //       );

      //       // Tính lại tổng giá tiền của giỏ hàng
      //       cart.totalPrice = cart.items.reduce((total, item) => {
      //         const itemPrice = item.totalItemPrice || 0;
      //         return total + itemPrice;
      //       }, 0);
      //     }
      //   });

      //   console.log("Redux state after update:", state.carts);
      // })
      .addCase(SelectCart.fulfilled, (state, action) => {
        console.log("action payload:", action.payload);
        const { allItems } = action.payload;

        // Duyệt qua tất cả các phần tử được cập nhật trong allItems
        allItems.forEach((updatedItem: CartItem) => {
          // Tìm giỏ hàng chứa sản phẩm được cập nhật
          const cart = state.carts.find((cart) =>
            cart.items.some(
              (item) => item.product._id === updatedItem.product._id
            )
          );

          if (cart) {
            // Cập nhật trạng thái của sản phẩm trong giỏ hàng
            cart.items = cart.items.map((item) =>
              item.product._id === updatedItem.product._id
                ? { ...item, isSelected: updatedItem.isSelected }
                : item
            );

            // Tính lại tổng giá tiền của giỏ hàng
            cart.totalPrice = cart.items.reduce((total, item) => {
              const itemPrice = item.isSelected ? item.totalItemPrice || 0 : 0;
              return total + itemPrice;
            }, 0);
          }
        });

        console.log("Redux state after update:", state.carts);
      })

      .addCase(SelectCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Cập nhật giỏ hàng thất bại";
      })
      .addCase(CheckVoucherThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        CheckVoucherThunk.fulfilled,
        (state, action: PayloadAction<CartType>) => {
          const updatedCart = action.payload;

          // Tìm giỏ hàng cần cập nhật dựa trên ID
          const cartIndex = state.carts.findIndex(
            (cart) => cart._id === updatedCart._id
          );

          if (cartIndex >= 0) {
            // Cập nhật giỏ hàng với thông tin mới sau khi áp dụng voucher
            state.carts[cartIndex] = updatedCart;
          }

          state.status = "succeeded";
          state.error = null;
        }
      )
      .addCase(CheckVoucherThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.error.message || "Đã xảy ra lỗi khi áp dụng voucher.";
      });
  },
});

export const { updateItemQuantity, toggleSelectCartItem } = cartSlice.actions;
export default cartSlice.reducer;
