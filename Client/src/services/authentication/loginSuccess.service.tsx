import Cookies from "js-cookie";
import instance from "../axios";
const API_URL = import.meta.env.VITE_API_URL;
export const apiLoginSuccessService = async (id: string, token: string) => {
  try {
    const response = await instance.post(`${API_URL}/auth/login-success`, {
      id,
      tokenLogin: token,
    });
    const { accessToken } = response.data;
    if (!accessToken) throw new Error("No access token received");
    Cookies.set("token", accessToken, {
      path: "/",
      expires: 7,
      secure: true,
      sameSite: "strict",
    });
    return response.data;
  } catch (error: any) {
    console.error("Error in apiLoginSuccessService:", error);
    return {
      status: error.response?.status || 500,
      message: error.response?.data?.message || "Đã xảy ra lỗi khi đăng nhập.",
    };
  }
};
