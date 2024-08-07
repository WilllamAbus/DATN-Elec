import instance from "../axios";
import { UserProfile } from "../../types/user";
const API_URL = import.meta.env.VITE_API_URL;
import { AppDispatch } from "../../redux/store";
import axios from "axios";
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

    const { accessToken, roles, name } = response.data;

    localStorage.setItem("token", accessToken);
    localStorage.setItem("roles", roles?.[0]?.name || "");
    localStorage.setItem("name", name || "");
    if (!accessToken) throw new Error("No access token received");

    localStorage.setItem("token", accessToken);
    localStorage.setItem("userProfile", JSON.stringify({ name, roles }));

    const persistRoot = JSON.parse(
      localStorage.getItem("persist:root") || "{}"
    );
    persistRoot.auth = JSON.stringify({
      login: {
        token: accessToken,
        currentUser: { name, roles },
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

    return { token: accessToken };
  } catch (error) {
    const errorMessage =
      (error as { response?: { data?: { message?: string } } })?.response?.data
        ?.message || "Thông tin đăng nhập không chính xác";
    throw new Error(errorMessage);
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

export const registerUser = async (user: {
  email: string;
  password: string;
  name: string;
}) => {
  const response = await instance.post(`${API_URL}/auth/register`, user);
  if (response.status === 200) {
    return response.data;
  }
  throw new Error(response.data.msg || "Đã xảy ra lỗi khi đăng ký.");
};
//xác thực email
export const verifyEmailService = async (token: string): Promise<string> => {
  const response = await fetch(`/api/auth/verifyEmail?token=${token}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to verify email");
  }

  const data = await response.json();
  return data.message || "Email verified successfully";
};
export const updatePassword = async (
  currentPassword: string,
  newPassword: string
) => {
  const response = await instance.put(`${API_URL}/auth/password`, {
    currentPassword,
    newPassword,
  });
  return response.data;
};
