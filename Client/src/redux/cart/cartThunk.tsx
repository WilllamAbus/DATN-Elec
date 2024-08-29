import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getCartList,
  addToCart,
  getCartById,
  updateCart,
  deleteCart,
} from "../../services/cart/cart";

export const fetchCartList = createAsyncThunk(
  "cart/fetchCartList",
  async () => {
    const response = await getCartList();
    return response;
  }
);

export const addProductToCart = createAsyncThunk(
  "cart/addProductToCart",
  async ({
    userId,
    productId,
    quantity,
  }: {
    userId: string;
    productId: string;
    quantity?: number;
  }) => {
    const response = await addToCart(userId, productId, quantity);
    return response;
  }
);

export const updateCartItem = createAsyncThunk(
  "cart/updateCartItemQuantity",
  async ({
    cartId,
    itemId,
    quantity,
  }: {
    cartId: string;
    itemId: string;
    quantity: number;
  }) => {
    const response = await updateCart(cartId, [
      {
        product: itemId,
        quantity,
      },
    ]);
    console.log("Update Cart Response:", response); // Kiểm tra phản hồi từ API
    return {
      cartId,
      itemId,
      quantity,
    };
  }
);

export const fetchCartById = createAsyncThunk(
  "cart/fetchCartById",
  async (cartId: string) => {
    const response = await getCartById(cartId);
    return response;
  }
);

export const removeCart = createAsyncThunk(
  "cart/removeCart",
  async (cartId: string) => {
    const response = await deleteCart(cartId);
    return response;
  }
);
