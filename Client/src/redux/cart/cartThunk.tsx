import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getCartList,
  addToCart,
  getCartById,
  updateCart,
  SelectCart as SelectCartService,
  deleteCart as deleteCartService,
  CheckVoucher,
} from "../../services/cart/cart";
import { CartType } from "../../types/cart/carts";
import axios from "axios";
export interface FetchCartListResponse {
  message: string;
  carts: CartType[]; // Sử dụng CartType[] để mô tả danh sách giỏ hàng
}

// Sửa đổi createAsyncThunk
export const fetchCartList = createAsyncThunk<FetchCartListResponse>(
  "cart/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCartList();
      console.log("API response:", response);
      // Giả sử API trả về đối tượng chứa carts
      if (!response || !response.carts) {
        throw new Error("No data returned from the API.");
      }
      return response;
    } catch (error) {
      console.error("Error fetching cart:", error);
      return rejectWithValue((error as Error).message);
    }
  }
);
// export const fetchCartList = createAsyncThunk<CartType[]>(
//   "cart/fetchAll",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await getCartList();
//       console.log("API response:", response);
//       if (!response) {
//         throw new Error("No data returned from the API.");
//       }
//       return response;
//     } catch (error) {
//       console.error("Error fetching cart:", error);
//       return rejectWithValue((error as Error).message);
//     }
//   }
// );

// Thêm sản phẩm vào giỏ hàng

export const addProductToCart = createAsyncThunk(
  "cart/addProductToCart",
  async (
    {
      productId,
      variantId,
      quantity = 1,
    }: { productId: string; variantId: string; quantity?: number },
    { rejectWithValue }
  ) => {
    try {
      if (isNaN(quantity) || quantity <= 0) {
        return rejectWithValue("Số lượng sản phẩm không hợp lệ");
      }

      const response = await addToCart(productId, variantId, quantity);
      return response;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Không thể thêm vào giỏ hàng."
        );
      } else if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("Đã xảy ra lỗi không xác định khi cập nhật giỏ hàng.");
      }
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
      variantId,
      isSelected = false,
    }: {
      cartId: string;
      itemId: string;
      quantity: number;
      variantId: string;
      isSelected?: boolean;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await updateCart(cartId, [
        {
          product: itemId,
          variantId,
          quantity,
          isSelected,
        },
      ]);
      console.log("Update Cart Response:", response);
      return {
        cartId,
        itemId,
        quantity,
        variantId,
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
    {
      cartId,
      productId,
      productVariantId,
    }: { cartId: string; productId?: string; productVariantId?: string },
    thunkAPI
  ) => {
    try {
      if (productId && productVariantId) {
        await deleteCartService(cartId, productId, productVariantId);
      } else if (productId) {
        await deleteCartService(cartId, productId);
      } else {
        await deleteCartService(cartId);
      }

      return { cartId, productId, productVariantId };
    } catch (error) {
      if (error instanceof Error) {
        return thunkAPI.rejectWithValue(error.message);
      } else {
        return thunkAPI.rejectWithValue("Unknown error occurred");
      }
    }
  }
);
// export const SelectCart = createAsyncThunk(
//   "cart/selectCart",
//   async (
//     {
//       productId,
//       items,
//     }: {
//       productId: string;
//       items: { productId: string }[];
//     },
//     { rejectWithValue }
//   ) => {
//     try {
//       const response = await SelectCartService({ productId, items }); // Gọi service với một đối tượng
//       return response; // Trả về response nếu chọn thành công
//     } catch (error) {
//       if (axios.isAxiosError(error) && error.response) {
//         return rejectWithValue(
//           error.response.data.message || "Chọn giỏ hàng thất bại."
//         );
//       } else {
//         return rejectWithValue(
//           (error as Error).message || "Chọn giỏ hàng thất bại."
//         );
//       }
//     }
//   }
// );
export const SelectCart = createAsyncThunk(
  "cart/selectCart",
  async (
    {
      selectAll,
      productId,
      items,
      cartId, // Thêm cartId vào tham số
    }: {
      selectAll?: boolean;
      productId?: string;
      items?: { productId: string; variantId: string; isSelected: boolean }[];
      cartId?: string; // Đảm bảo cartId được cung cấp
    },
    { rejectWithValue }
  ) => {
    try {
      // Gọi SelectCartService và truyền cartId vào nếu cần
      const response = await SelectCartService({
        selectAll,
        productId,
        items,
        cartId,
      });
      return response; // Trả về response khi chọn giỏ hàng thành công
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

export const CheckVoucherThunk = createAsyncThunk(
  "cart/CheckVoucher",
  async (
    {
      cartId,
      voucherId,
    }: {
      cartId: string;
      voucherId: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await CheckVoucher({ cartId, voucherId });
      return response;
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
