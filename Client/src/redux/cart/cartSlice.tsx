import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchCartList,
  addProductToCart,
  fetchCartById,
  removeCart,
  updateCartItem,
} from "./cartThunk";
import { CartType } from "../../types/cart/carts";

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
      }>
    ) {
      const { cartId, itemId, quantity } = action.payload;

      const cartIndex = state.carts.findIndex((cart) => cart._id === cartId);
      if (cartIndex !== -1) {
        const itemIndex = state.carts[cartIndex].items.findIndex(
          (item) => item._id === itemId
        );
        if (itemIndex !== -1) {
          state.carts[cartIndex].items[itemIndex].quantity = quantity;
          state.carts[cartIndex].items[itemIndex].totalItemPrice =
            quantity * state.carts[cartIndex].items[itemIndex].price;

          // Update total price of the cart
          state.carts[cartIndex].totalPrice = state.carts[
            cartIndex
          ].items.reduce((total, item) => total + item.totalItemPrice, 0);

          // Log the updated quantity and state for debugging
          console.log(
            `Updated quantity for item ${itemId} in cart ${cartId}: ${quantity}`
          );
          console.log("Current state:", state.carts);
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
        if (Array.isArray(action.payload)) {
          state.carts = action.payload;
        } else {
          state.error = "Invalid data format";
        }
      })
      .addCase(fetchCartList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload
          ? String(action.payload)
          : "Failed to fetch carts";
      })

      .addCase(addProductToCart.fulfilled, (state, action) => {
        state.carts.push(action.payload);
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        const { cartId, itemId, quantity } = action.payload;

        const cartIndex = state.carts.findIndex((cart) => cart._id === cartId);
        if (cartIndex !== -1) {
          const itemIndex = state.carts[cartIndex].items.findIndex(
            (item) => item._id === itemId
          );
          if (itemIndex !== -1) {
            state.carts[cartIndex].items[itemIndex].quantity = quantity;
            state.carts[cartIndex].items[itemIndex].totalItemPrice =
              quantity * state.carts[cartIndex].items[itemIndex].price;

            // Update total price of the cart
            state.carts[cartIndex].totalPrice = state.carts[
              cartIndex
            ].items.reduce((total, item) => total + item.totalItemPrice, 0);

            // Log the updated quantity and state for debugging
            console.log(
              `Updated quantity for item ${itemId} in cart ${cartId}: ${quantity}`
            );
            console.log("Current state:", state.carts);
          }
        }
      })
      .addCase(fetchCartById.fulfilled, (state, action) => {
        const index = state.carts.findIndex(
          (cart) => cart._id === action.payload._id
        );
        if (index !== -1) {
          state.carts[index] = action.payload;
        } else {
          state.carts.push(action.payload);
        }
      })
      .addCase(removeCart.fulfilled, (state, action) => {
        state.carts = state.carts.filter(
          (cart) => cart._id !== action.payload._id
        );
      });
  },
});

export const { updateItemQuantity } = cartSlice.actions;
export default cartSlice.reducer;
