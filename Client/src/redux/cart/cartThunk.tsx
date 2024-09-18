// features/cart/cartThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getCartList,
  addToCart,
  getCartById,
  updateCart,
  // deleteProductCart,
  deleteCart as deleteCartService,
} from "../../services/cart/cart";
import { CartType } from "../../types/cart/carts";
import axios from "axios";
// Lấy danh sách giỏ hàng
// export const fetchCartList = createAsyncThunk(
//   "cart/fetchCartList",
//   async () => {
//     const response = await getCartList();
//     console.log(response);

//     return response.data; // Trả về data từ response
//   }
// );
export const fetchCartList = createAsyncThunk<CartType[]>(
  "categories/fetchAll",
  async () => {
    return await getCartList();
  }
);

// Thêm sản phẩm vào giỏ hàng
export const addProductToCart = createAsyncThunk(
  "cart/addProductToCart",
  async ({
    userId,
    productId,
    quantity = 1,
  }: {
    userId: string;
    productId: string;
    quantity?: number;
  }) => {
    const response = await addToCart(userId, productId, quantity);
    return response.data; // Trả về data từ response
  }
);

// Cập nhật số lượng sản phẩm trong giỏ hàng
// export const updateCartItem = createAsyncThunk(
//   "cart/updateCartItemQuantity",
//   async ({
//     cartId,
//     itemId,
//     quantity,
//   }: {
//     cartId: string;
//     itemId: string;
//     quantity: number;
//   }) => {
//     const response = await updateCart(cartId, [
//       {
//         product: itemId,
//         quantity,
//       },
//     ]);
//     console.log("Update Cart Response:", response); // Kiểm tra phản hồi từ API
//     return {
//       cartId,
//       itemId,
//       quantity,
//     };
//   }
// );
export const updateCartItem = createAsyncThunk(
  "cart/updateCartItemQuantity",
  async (
    {
      cartId,
      itemId,
      quantity,
      isSelected = false,
    }: {
      cartId: string;
      itemId: string;
      quantity: number;
      isSelected?: boolean;
    },
    { rejectWithValue } // Tham số `rejectWithValue` để trả về giá trị lỗi
  ) => {
    try {
      const response = await updateCart(cartId, [
        {
          product: itemId,
          quantity,
          isSelected,
        },
      ]);
      console.log("Update Cart Response:", response);
      return {
        cartId,
        itemId,
        quantity,
        isSelected,
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data.message || "Cập nhật số lượng thất bại."
        );
      } else {
        return rejectWithValue(
          (error as Error).message || "Cập nhật số lượng thất bại."
        );
      }
    }
  }
);
// Lấy giỏ hàng theo ID
export const fetchCartById = createAsyncThunk(
  "cart/fetchCartById",
  async (cartId: string) => {
    const response = await getCartById(cartId);
    return response.data; // Trả về data từ response
  }
);

// Thunk để xóa sản phẩm khỏi giỏ hàng
export const deleteCart = createAsyncThunk(
  "cart/deleteCart",
  async (
    { cartId, productId }: { cartId: string; productId: string },
    thunkAPI
  ) => {
    try {
      await deleteCartService(cartId, productId);
      return { cartId, productId }; // Trả về cartId và productId để cập nhật state
    } catch (error) {
      if (error instanceof Error) {
        return thunkAPI.rejectWithValue(error.message);
      } else {
        return thunkAPI.rejectWithValue("Unknown error occurred");
      }
    }
  }
);
