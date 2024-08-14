import instance from "../axios";

const API_URL = import.meta.env.VITE_API_URL;

export const apiLoginSuccessService = async (id: string, token: string) => {
  try {
    const res = await instance.post(`${API_URL}/auth/login-success`, { id, tokenLogin: token });
    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data || err.message);
  }
};
