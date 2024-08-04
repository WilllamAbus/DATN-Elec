import instance from "../axios";
import { UserProfile } from "../../types/user";
import {
  loginFailed,
  loginStart,
  loginSuccess,
  setProfile,
} from "../../redux/auth/authSlice";
import { AppDispatch } from "../../redux/store";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const loginUser = async (
  user: { email: string; password: string },
  dispatch: AppDispatch,
  navigate: (path: string) => void
) => {
  dispatch(loginStart());

  try {
    const response = await instance.post(`${API_URL}/auth/login`, user);
    const { accessToken, roles, name } = response.data;

    // Lưu thông tin vào localStorage
    localStorage.setItem("token", accessToken);
    localStorage.setItem("roles", roles?.[0]?.name || ""); // Lưu role nếu có
    localStorage.setItem("name", name || ""); // Lưu tên nếu có

    // Lưu token vào localStorage với cấu trúc JSON (nếu cần)
    window.localStorage.setItem(
      "persist:root",
      JSON.stringify({
        login: {
          currentUser: {
            accessToken,
          },
        },
      })
    );

    dispatch(loginSuccess({ currentUser: name, token: accessToken }));
    navigate("/profile");
  } catch (err: any) {
    if (err.response && err.response.data) {
      dispatch(loginFailed(err.response.data.msg || "Đã xảy ra lỗi"));
    } else {
      dispatch(loginFailed());
    }
  }
};

export const getProfile = () => {
  return async (dispatch: AppDispatch) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await instance.get(`${API_URL}/auth/profile`);
      dispatch(setProfile(response.data));
    } catch (err: any) {
      console.error("Failed to fetch profile:", err);
      if (err.response?.status === 401) {
        console.error("Unauthorized: Token might be invalid or expired.");
      }
    }
  };
};

export const logout = async (): Promise<void> => {
  try {
    await instance.post("/auth/logout");
    localStorage.removeItem("token");
    localStorage.removeItem("roles");
    localStorage.removeItem("name");
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};
export const updateProfile = async (
  profileData: UserProfile
): Promise<UserProfile> => {
  try {
    const response = await instance.put("/auth/profile", profileData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};

export const registerApi = async ({
  email,
  password,
  name,
}: {
  email: string;
  password: string;
  name: string;
}): Promise<UserProfile> => {
  try {
    const response = await instance.post("/auth/register", {
      email,
      password,
      name,
      device: "website",
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};
