import axios from "axios";
import instance from "../axios";
import { CartType } from "../../types/cart/carts";
const API_URL = import.meta.env.VITE_API_URL;
interface FetchCartListResponse {
  message: string;
  carts: CartType[]; // Sử dụng CartType[] để mô tả danh sách giỏ hàng
}
// export const getCartList = async (): Promise<CartType[]> => {
//   try {
//     const response = await instance.get(`${API_URL}/cart/list`);
//     return response.data;
//   } catch (error) {
//     if (axios.isAxiosError(error) && error.response) {
//       throw new Error(error.response.data.message || error.message);
//     } else if (error instanceof Error) {
//       throw new Error(error.message);
//     } else {
//       throw new Error(
//         "Đã xảy ra lỗi không xác định khi lấy danh sách giỏ hàng."
//       );
//     }
//   }
// };
export const getCartList = async (): Promise<FetchCartListResponse> => {
  try {
    const response = await instance.get(`${API_URL}/cart/list`);
    return response.data; // Giả sử response.data có cấu trúc { message: string, carts: CartType[] }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || error.message);
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(
        "Đã xảy ra lỗi không xác định khi lấy danh sách giỏ hàng."
      );
    }
  }
};

// export const addToCart = async (
//   userId: string,
//   productId: string,
//   quantity: number = 1 // Đặt mặc định quantity là 1
// ) => {
//   try {
//     const response = await instance.post(`${API_URL}/cart/add`, {
//       user: userId,
//       items: [
//         {
//           product: productId,
//           quantity: quantity > 0 ? quantity : 1, // Đảm bảo quantity không nhỏ hơn 1
//         },
//       ],
//     });
//     return response.data;
//   } catch (error) {
//     if (axios.isAxiosError(error) && error.response) {
//       throw new Error(error.response.data.message || error.message);
//     } else if (error instanceof Error) {
//       throw new Error(error.message);
//     } else {
//       throw new Error("An unknown error occurred while add the cart.");
//     }
//   }
// };
export const addToCart = async (
  productId: string,
  variantId: string, // Thêm variantId làm tham số
  quantity: number = 1 // Đặt mặc định quantity là 1
) => {
  try {
    const response = await instance.post(`${API_URL}/cart/add`, {
      items: [
        {
          product: productId,
          variantId: variantId, // Truyền variantId vào payload
          quantity: quantity > 0 ? quantity : 1, // Đảm bảo quantity không nhỏ hơn 1
        },
      ],
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || error.message);
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred while updating the cart.");
    }
  }
};

export const updateCart = async (
  cartId: string,
  items: {
    product: string;
    variantId: string;
    quantity: number;
    isSelected?: boolean;
  }[]
) => {
  try {
    const response = await instance.put(`${API_URL}/cart/${cartId}`, { items });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || error.message);
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred while updating the cart.");
    }
  }
};

export const getCartById = async (cartId: string) => {
  const response = await instance.get(`${API_URL}/cart/${cartId}`);
  return response.data;
};

// export const deleteCart = (cartId: string, productId: string) => {
//   return instance.delete(`${API_URL}/cart/${cartId}/${productId}`);
// };
export const deleteCart = (
  cartId: string,
  productId?: string,
  productVariantId?: string
) => {
  // Xây dựng URL động dựa trên các tham số
  let url = `${API_URL}/cart/${cartId}`;

  // Thêm productId và productVariantId vào URL nếu có
  if (productId) {
    url += `/${productId}`;
    if (productVariantId) {
      url += `/${productVariantId}`;
    }
  }

  return instance.delete(url);
};

// export const SelectCart = async ({
//   productId,
//   items,
// }: {
//   productId: string;
//   items: { productId: string }[];
// }) => {
//   try {
//     const response = await instance.put(
//       `${API_URL}/cart/isSelect/${productId}`,
//       { items }
//     );
//     return response.data;
//   } catch (error) {
//     if (axios.isAxiosError(error) && error.response) {
//       throw new Error(error.response.data.message || error.message);
//     } else if (error instanceof Error) {
//       throw new Error(error.message);
//     } else {
//       throw new Error("Đã xảy ra lỗi không xác định khi chọn giỏ hàng.");
//     }
//   }
// };
export const SelectCart = async ({
  selectAll,
  productId,
  items,
  cartId,
}: {
  selectAll?: boolean;
  productId?: string;
  items?: { productId: string; variantId: string; isSelected: boolean }[];
  cartId?: string;
}) => {
  try {
    let response;
    if (selectAll !== undefined) {
      response = await instance.put(`${API_URL}/cart/isSelect/${cartId}`, {
        selectAll,
      });
    } else if (productId) {
      response = await instance.put(`${API_URL}/cart/isSelect/${productId}`, {
        items,
      });
    }
    if (response) {
      return response.data;
    } else {
      throw new Error("Không nhận được phản hồi từ server.");
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || error.message);
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Đã xảy ra lỗi không xác định khi chọn giỏ hàng.");
    }
  }
};

export const CheckVoucher = async ({
  cartId,
  voucherId,
}: {
  cartId: string;
  voucherId: string;
}) => {
  try {
    const response = await instance.post(`${API_URL}/cart/apply-voucher`, {
      cartId,
      voucherId,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || error.message);
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Đã xảy ra lỗi không xác định khi chọn giỏ hàng.");
    }
  }
};
