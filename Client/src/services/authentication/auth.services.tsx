import axios from "axios";
import instance from "../axios";
import Cookies from "js-cookie";
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

export const loginUser = async (user: { email: string; password: string }) => {
  try {
    const response = await instance.post(`${API_URL}/auth/login`, user);
    console.log("API Response:", response.data);

    const { accessToken } = response.data;

    // Lưu token vào cookie
    Cookies.set("token", accessToken, {
      path: "/",
      expires: 7,
      secure: true,
      sameSite: "strict",
    });

    // Lưu trữ thông tin vào localStorage
    // localStorage.setItem("roles", roles?.[0]?.name || "");
    // localStorage.setItem("name", name || "");
    // localStorage.setItem("userProfile", JSON.stringify({ name, roles, email }));

    return {
      status: response.status,
      message: response.data.message,
      token: accessToken,
    };
  } catch (error: any) {
    console.error("Login error:", error);
    return {
      status: error.response?.status || 500,
      message: error.response?.data?.message || "Đã xảy ra lỗi khi đăng nhập.",
    };
  }
};
export const getProfile = async () => {
  try {
    const response = await instance.get(`/auth/profile`);
    console.log("Profile data:", response.data);
    return response.data;
  } catch (error: unknown) {
    const err = error as Error; // Type assertion
    console.error("Error fetching profile:", err.message);
    throw new Error("Failed to fetch profile: " + err.message);
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
    const response = await axios.post(`${API_URL}/resendEmail`, { email });
    return {
      status: response.status,
      message: response.data.message,
      data: response.data,
    };
  } catch (error: any) {
    return {
      status: error.response?.status || 500,
      message:
        error.response?.data?.message || "Đã xảy ra lỗi khi yêu cầu xác lại.",
    };
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
