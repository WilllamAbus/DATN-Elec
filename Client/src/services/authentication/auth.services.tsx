import axios from "axios";
import instance from "../axois_V2";
// import { UserProfile } from "../../types/user";
const API_URL = import.meta.env.VITE_API_URL;
// import { AppDispatch } from "../../redux/store";
// import axios from "axios";
// export const loginUser = async (user: { email: string; password: string }) => {
//   try {
//     const response = await instance.post(`${API_URL}/auth/login`, user);
//     console.log("API Response:", response.data);

//     // const { accessToken } = response.data;
//     const { accessToken, roles, name } = response.data;
//     localStorage.setItem("token", accessToken);
//     localStorage.setItem("roles", roles?.[0]?.name || "");
//     localStorage.setItem("name", name || "");
//     // Lấy dữ liệu hiện tại từ localStorage
//     const persistRoot = JSON.parse(
//       localStorage.getItem("persist:root") || "{}"
//     );

//     // Cập nhật dữ liệu với token mới
//     persistRoot.auth = JSON.stringify({
//       login: {
//         token: accessToken,
//         currentUser: null, // Thay đổi nếu cần
//         isFetching: false,
//         error: null,
//         isAuthenticated: true,
//         isLoggedIn: true,
//       },
//       profile: persistRoot.auth?.profile || {},
//       register: persistRoot.auth?.register || {},
//       users: persistRoot.auth?.users || [],
//     });

//     localStorage.setItem("persist:root", JSON.stringify(persistRoot));
//     console.log("Token after login:", localStorage.getItem("persist:root"));

//     return { token: accessToken };
//   } catch (error) {
//     const errorMessage =
//       (error as { response?: { data?: { message?: string } } })?.response?.data
//         ?.message || "An error occurred during login";
//     throw new Error(errorMessage);
//   }
// };
export const loginUser = async (user: { email: string; password: string }) => {
  try {
    const response = await instance.post("/auth/login", user);
    console.log("API Response:", response.data);

    const { accessToken, roles, name, email } = response.data;

    localStorage.setItem("token", accessToken);
    localStorage.setItem("roles", roles?.[0]?.name || "");
    localStorage.setItem("name", name || "");
    localStorage.setItem("userProfile", JSON.stringify({ name, roles, email }));

    if (!accessToken) throw new Error("No access token received");

    localStorage.setItem("token", accessToken);

    const persistRoot = JSON.parse(
      localStorage.getItem("persist:root") || "{}"
    );

    persistRoot.auth = JSON.stringify({
      login: {
        token: accessToken,
        currentUser: { roles },
        isFetching: false,
        error: null,
        isAuthenticated: true,
        isLoggedIn: true,
      },
      profile: persistRoot.auth?.profile || {},
      register: persistRoot.auth?.register || {},
      users: persistRoot.auth?.users || [],
    });

    localStorage.setItem("persist:root", JSON.stringify(persistRoot));
    console.log("Token after login:", localStorage.getItem("persist:root"));
    return {
      status: response.status,
      message: response.data.message,
      token: accessToken,
    };
  } catch (error: any) {
    return {
      status: error.response?.status || 500,
      message: error.response?.data?.message || "Đã xảy ra lỗi khi đăng nhập.",
    };
  }
};

export const getProfile = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  try {
    const response = await instance.get(`${API_URL}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error("Error fetching profile:", (error as Error).message);
    throw new Error("Failed to fetch profile: " + (error as Error).message);
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
  localStorage.removeItem("token");
  localStorage.removeItem("roles");
  localStorage.removeItem("name");
};

export const updateProfile = async (formData: FormData) => {
  const response = await instance.put(`${API_URL}/auth/profile`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// export const registerUser = async (user: {
//   email: string;
//   password: string;
//   name: string;
// }) => {
//   const response = await instance.post(`${API_URL}/auth/register`, user);
//   if (response.status === 200) {
//     return response.data;
//   }
//   throw new Error(response.data.msg || "Đã xảy ra lỗi khi đăng ký.");
// };

export const registerUser = async (user: {
  email: string;
  password: string;
  name: string;
}) => {
  try {
    const response = await instance.post(`${API_URL}/auth/register`, user);
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

//xác thực email

export const verifyEmail = async (token: string) => {
  try {
    const response = await axios.get(`${API_URL}/auth/verifyEmail`, {
      params: { token },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // Xử lý lỗi từ Axios
      throw new Error(
        `Error verifying email: ${error.response.data.message || error.message}`
      );
    } else if (error instanceof Error) {
      throw new Error(`Error verifying email: ${error.message}`);
    } else {
      throw new Error("Error verifying email: An unknown error occurred");
    }
  }
};

// Function to handle forgot password
export const forgotPassword = async (email: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/forgot-password`, {
      email,
    });

    // Trả về thông tin chi tiết về phản hồi
    return {
      status: response.status,
      message: response.data.message,
      data: response.data,
    };
  } catch (error: any) {
    // Xử lý lỗi và trả về thông tin chi tiết về lỗi
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
      data: response.data,
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
