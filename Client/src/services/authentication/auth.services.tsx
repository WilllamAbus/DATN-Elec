import { Login, Registe } from "../../types/user";
import request from "../../config/Auth";
import axios from "axios";
import { UserProfile } from "../../types/user";
export interface LoginResponse {
  accessToken: string;
  roles: { name: string }[]; // Thay đổi để chứa tên vai trò
  name: string;
}

export interface RegisterResponse {
  user?: any;
  msg?: string;
  accessToken?: string;
}

const loginApi = async ({ email, password }: Login) => {
  const res = await request({
    path: "auth/login",
    method: "POST",
    data: {
      email: email,
      password: password,
      device: "website",
    },
  });

  return res;
};

const getProfile = async (): Promise<UserProfile> => {
  const res = await request({
    path: "auth/profile",
    method: "GET",
  });

  return res as UserProfile;
};

const registerApi = async ({
  email,
  password,
  name,
}: Registe): Promise<RegisterResponse> => {
  try {
    const res = await request({
      path: "auth/register",
      method: "POST",
      data: {
        email: email,
        password: password,
        name: name,
        device: "website",
      },
    });

    return res;
  } catch (err) {
    // Truyền lỗi cho component xử lý
    if (axios.isAxiosError(err) && err.response) {
      // Ném lỗi với thông tin phản hồi từ server
      throw err.response.data;
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};
export { loginApi, getProfile, registerApi };
