// features/cart/cartThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getCartList,
  addToCart,
  getCartById,
  updateCart,
  SelectCart as SelectCartService,
  deleteCart as deleteCartService,
} from "../../services/cart/cart";
import { CartType } from "../../types/cart/carts";
import axios from "axios";

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
    try {
      const response = await addToCart(userId, productId, quantity);
      return response;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Lỗi khi thêm sản phẩm vào giỏ hàng"
      );
    }
  }
);

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
  async (cartId: string, { rejectWithValue }) => {
    try {
      const response = await getCartById(cartId);
      console.log("API response:", response); // Log the full response
      if (!response) {
        throw new Error("No data returned from the API.");
      }
      return response; // Ensure this returns the expected data
    } catch (error) {
      console.error("Error fetching cart:", error); // Log the error
      return rejectWithValue((error as Error).message); // Catch any errors
    }
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
export const SelectCart = createAsyncThunk(
  "cart/selectCart",
  async (
    {
      productId,
      items,
    }: {
      productId: string;
      items: { productId: string }[];
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await SelectCartService({ productId, items }); // Gọi service với một đối tượng
      return response; // Trả về response nếu chọn thành công
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data.message || "Chọn giỏ hàng thất bại."
        );
      } else {
        return rejectWithValue(
          (error as Error).message || "Chọn giỏ hàng thất bại."
        );
      }
    }
  }
);
