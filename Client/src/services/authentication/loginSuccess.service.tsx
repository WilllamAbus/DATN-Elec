import instance from "../axois_V2";

const API_URL = import.meta.env.VITE_API_URL;

// export const apiLoginSuccessService = async (id: string, token: string) => {
//   try {
//     const res = await instance.post(`${API_URL}/auth/login-success`, {
//       id,
//       tokenLogin: token,
//     });
//     return res.data;
//   } catch (err: any) {
//     throw new Error(err.response?.data || err.message);
//   }
// };

// export const apiLoginSuccessService = async (id: string, token: string) => {
//   try {
//     const response = await instance.post(`${API_URL}/auth/login-success`, {
//       id,
//       tokenLogin: token,
//     });
//     console.log("API Response:", response.data);

//     const { token: accessToken, roles, name, email, avatar } = response.data;

//     if (!accessToken) throw new Error("No access token received");

//     // Lưu thông tin vào localStorage
//     localStorage.setItem("token", accessToken);
//     localStorage.setItem("roles", roles?.[0]?.name || "");
//     localStorage.setItem("name", name || "");
//     localStorage.setItem(
//       "userProfile",
//       JSON.stringify({ name, roles, email, avatar })
//     );

//     return {
//       status: response.status,
//       message: response.data.message,
//       token: accessToken,
//     };
//   } catch (error: any) {
//     return {
//       status: error.response?.status || 500,
//       message: error.response?.data?.message || "Đã xảy ra lỗi khi đăng nhập.",
//     };
//   }
// };
export const apiLoginSuccessService = async (id: string, token: string) => {
  try {
    const response = await instance.post(`${API_URL}/auth/login-success`, {
      id,
      tokenLogin: token,
    });
    console.log("API Response:", response.data);

    const { token: accessToken, roles, name, email, avatar } = response.data;

    if (!accessToken) throw new Error("No access token received");

    // Lưu thông tin vào localStorage
    localStorage.setItem("token", accessToken);
    localStorage.setItem("roles", roles?.[0]?.name || "");
    localStorage.setItem("name", name || "");
    localStorage.setItem(
      "userProfile",
      JSON.stringify({ name, roles, email, avatar })
    );

    // Trả về toàn bộ dữ liệu từ response
    return response.data;
  } catch (error: any) {
    return {
      status: error.response?.status || 500,
      message: error.response?.data?.message || "Đã xảy ra lỗi khi đăng nhập.",
    };
  }
};
