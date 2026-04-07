import axios from "axios";
import instance from "../axios";
import Cookies from "js-cookie";
import {
  Address,
  AddressResponse,
  LimitCrudUserResponse,
  UserProfile,
} from "../../types/user";
import { LimitCrudWathlistResponse } from "../../types/cart/profile/wathlist";
const API_URL = import.meta.env.VITE_API_URL;

export const registerUser = async (user: {
  email: string;
  password: string;
  name: string;
}) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, user);
    return {
      status: response.status,
      message: response.data.message,
    };
  } catch (error: any) {
    return {
      status: error.response?.status || 500,
      message: error.response?.data?.message || "Đã xảy ra lỗi khi đăng ký.",
    };
  }
};
export const loginUser = async (user: {
  email: string;
  password: string;
}): Promise<UserProfile> => {
  try {
    const response = await instance.post(
      `${import.meta.env.VITE_API_URL}/auth/login`,
      user
    );
    console.log("API Response:", response);

    const userProfile: UserProfile = response.data;

    // Lưu token vào cookie
    Cookies.set("token", userProfile.accessToken, {
      path: "/",
      expires: 7,
      secure: true,
      sameSite: "strict",
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

// export const loginUser = async (user: {
//   email: string;
//   password: string;
// }): Promise<UserProfile | { status: number; message: string }> => {
//   try {
//     const response = await instance.post(`${API_URL}/auth/login`, user);
//     console.log("API Response:", response);
//     // Giả sử rằng phản hồi API trả về một đối tượng UserProfile
//     const userProfile: UserProfile = response.data;

//     // Lưu token vào cookie
//     Cookies.set("token", userProfile.accessToken, {
//       path: "/",
//       expires: 7,
//       secure: true,
//       sameSite: "strict",
//     });

//     // Trả về toàn bộ đối tượng UserProfile
//     return {
//       ...userProfile,
//       status: response.status,
//       message: userProfile.message || "Đăng nhập thành công!",
//     };
//   } catch (error: any) {
//     // Trả về thông tin lỗi nếu có
//     return {
//       status: error.response?.status || 500,
//       message: error.response?.data?.message || "Đã xảy ra lỗi khi đăng nhập.",
//     };
//   }
// };

export const getProfile = async () => {
  try {
    const response = await instance.get(`/auth/profile`);
    return response.data;
  } catch (error: any) {
    // Trả về thông tin lỗi nếu có
    return {
      status: error.response?.status || 500,
      message: error.response?.data?.message || "Đã xảy ra lỗi .",
    };
  }
};
export const getList = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const response = await instance.get(`${API_URL}/auth/list`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.data;
};

export const logout = async () => {
  await instance.post(`${API_URL}/auth/logout`);
  Cookies.remove("token");
  Cookies.remove("refreshToken");
};

export const updateProfile = async (formData: FormData) => {
  const response = await instance.put(`${API_URL}/auth/profile`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

//xác thực email
export const verifyEmail = async (token: string) => {
  try {
    const response = await axios.get(`${API_URL}/auth/verifyEmail`, {
      params: { token },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error(
        `Error verifying email: ${error.response.data.message || error.message}`
      );
      throw new Error(error.response.data.message || error.message);
    } else if (error instanceof Error) {
      console.error(`Error verifying email: ${error.message}`);
      throw new Error(error.message);
    } else {
      console.error("Error verifying email: An unknown error occurred");
      throw new Error("An unknown error occurred");
    }
  }
};

export const resendEmail = async (email: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/resendEmail`, { email });
    return response.data;
  } catch (error) {
    throw error;
  }
};
// yêu cầu mail reset
export const forgotPassword = async (email: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/forgot-password`, {
      email,
    });
    return {
      status: response.status,
      message: response.data.message,
      data: response.data,
    };
  } catch (error: any) {
    return {
      status: error.response?.status || 500,
      message:
        error.response?.data?.message ||
        "Đã xảy ra lỗi khi gửi yêu cầu quên mật khẩu.",
    };
  }
};

export const updatePassword = async (
  currentPassword: string,
  newPassword: string
) => {
  try {
    const response = await instance.put(`${API_URL}/auth/password`, {
      currentPassword,
      newPassword,
    });
    return {
      status: response.status,
      message: response.data.message,
    };
  } catch (error: any) {
    return {
      status: error.response?.status || 500,
      message:
        error.response?.data?.message || "Đã xảy ra lỗi khi cập nhật mật khẩu.",
    };
  }
};

export const resetPassword = async (token: string, password: string) => {
  try {
    const response = await axios.put(`${API_URL}/auth/resetPassword`, {
      token,
      password,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        `Error resetPassword: ${error.response.data.message || error.message}`
      );
    } else if (error instanceof Error) {
      throw new Error(`Error resetPassword: ${error.message}`);
    } else {
      throw new Error("Error resetPassword: An unknown error occurred");
    }
  }
};
export const addToWatchlist = async (variantId: string) => {
  try {
    const response = await instance.post(
      `${API_URL}/wathlist/add/${variantId}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        `Error adding to watchlist: ${
          error.response.data.message || error.message
        }`
      );
    } else if (error instanceof Error) {
      throw new Error(`Error adding to watchlist: ${error.message}`);
    } else {
      throw new Error("Error adding to watchlist: An unknown error occurred");
    }
  }
};

export const CheckWatchlist = async () => {
  try {
    const response = await instance.get(`${API_URL}/wathlist/`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || error.message);
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Error fetching watchlist: An unknown error occurred");
    }
  }
};
export const getWatchlist = async (
  page: number,
  search?: string
): Promise<LimitCrudWathlistResponse> => {
  try {
    const queryParams = new URLSearchParams({ page: page.toString() });

    if (search) {
      queryParams.append("search", search);
    }

    const response = await instance.get<LimitCrudWathlistResponse>(
      `${API_URL}/wathlist/limit/?${queryParams.toString()}`
    );
    console.log("Response data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching Order:", error);
    throw new Error("Failed to fetch Order");
  }
};

export const DeleteWatchlist = async (variantId: string) => {
  try {
    const response = await instance.delete(
      `${API_URL}/wathlist/delete/${variantId}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || error.message);
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(
        "Error deleting from watchlist: An unknown error occurred"
      );
    }
  }
};
export const addAddress = async (addressData: Address) => {
  try {
    const response = await instance.post(`${API_URL}/auth/add`, addressData);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || error.message);
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Error updating order detail: An unknown error occurred");
    }
  }
};

// UPDATE: Cập nhật địa chỉ
export const updateAddress = async (addressData: Address) => {
  try {
    const response = await instance.put(`${API_URL}/auth/update`, addressData);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || error.message);
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Error updating address: An unknown error occurred");
    }
  }
};

// export const updateAddress = async (id: string, addressData: Address) => {
//   try {
//     const response = await instance.put(
//       `${API_URL}/auth/update/${id}`,
//       addressData
//     );

//     return response.data;
//   } catch (error) {
//     if (axios.isAxiosError(error) && error.response) {
//       throw new Error(error.response.data.message || error.message);
//     } else if (error instanceof Error) {
//       throw new Error(error.message);
//     } else {
//       throw new Error("Error updating address: An unknown error occurred");
//     }
//   }
// };

//GET: danh sách địa chỉ
export const fetchAddressList = async (): Promise<AddressResponse> => {
  try {
    const response = await instance.get(`${API_URL}/auth/listAddress`);
    console.log("fetchAddressList", response);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || error.message);
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Error fetching listAddress: An unknown error occurred");
    }
  }
};
//PUT: set mặc định
export const setDefaultAddress = async (addressId: string) => {
  try {
    const response = await instance.put(`${API_URL}/auth/set-default`, {
      addressId,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
// DELETE: Xóa địa chỉ
export const deleteAddress = async (_id: string) => {
  try {
    const response = await instance.delete(`${API_URL}/auth/deleteAddress`, {
      data: {
        addressId: _id,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};
export const fetchAddressById = async (addressId: string) => {
  try {
    const response = await instance.get(
      `${API_URL}/auth/listAddress/${addressId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const pagiCrudUser = async (
  page: number,
  search?: string
): Promise<LimitCrudUserResponse> => {
  try {
    const queryParams = new URLSearchParams({ page: page.toString() });

    if (search) {
      queryParams.append("search", search);
    }

    const response = await instance.get<LimitCrudUserResponse>(
      `/admin/limit/?${queryParams.toString()}`
    );
    console.log("Response data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching User:", error);
    throw new Error("Failed to fetch User");
  }
};

// export const deleteAddress = async (_id: string) => {
//   try {
//     const response = await instance.delete(`${API_URL}/auth/deleteAddress`, {
//       data: {
//         addressId: _id,
//       },
//     });

//     return response.data;
//   } catch (error) {
//     if (axios.isAxiosError(error) && error.response) {
//       throw new Error(error.response.data.message || error.message);
//     } else if (error instanceof Error) {
//       throw new Error(error.message);
//     } else {
//       throw new Error("Error fetching listAddress: An unknown error occurred");
//     }
//   }
// };
