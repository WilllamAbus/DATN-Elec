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
export interface Profile {
  name: string;
  email: string;
  birthday: string;
  gender: string;
  phone: string;
  address?: string;
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
const updateProfile = async (profileData: UserProfile): Promise<UserProfile> => {
  try {
    const res = await request({
      path: "auth/profile",
      method: "PUT",
      data: profileData,
    });

    return res as UserProfile;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      throw err.response.data;
    } else {
      throw new Error("An unknown error occurred");
    }
  }
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
  
    if (axios.isAxiosError(err) && err.response) {
      
      throw err.response.data;
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};
export { loginApi, getProfile, registerApi,updateProfile };
