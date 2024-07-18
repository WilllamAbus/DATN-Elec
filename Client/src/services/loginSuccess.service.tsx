import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const AuthService = {
  loginSuccess: async (id: string, tokenLogin: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login-success`, {
        id,
        tokenLogin
      });

      if (response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
      }

      return response.data;
    } catch (error: any) { // Chỉ định kiểu dữ liệu là 'any' cho biến error
      throw new Error(`Error logging in: ${error.message}`);
    }
  }
};

export default AuthService;
