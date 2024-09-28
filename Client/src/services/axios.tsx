// import axios from "axios";
// import Cookies from "js-cookie";
// import { useNavigate } from "react-router-dom";

// const instance = axios.create({
//   baseURL: import.meta.env.VITE_API_URL,
//   withCredentials: true,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// instance.interceptors.request.use(
//   function (config) {
//     const token = Cookies.get("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   function (error) {
//     return Promise.reject(error);
//   }
// );

// instance.interceptors.response.use(
//   function (response) {
//     return response;
//   },
//   async function (error) {
//     const originalRequest = error.config;

//     if (
//       error.response &&
//       (error.response.status === 401 || error.response.status === 403) &&
//       !originalRequest._retry
//     ) {
//       originalRequest._retry = true;
//       const token = Cookies.get("token");
//       if (!token) {
//         const navigate = useNavigate();

//         navigate("/login");
//         return Promise.reject(error);
//       }
//       try {
//         const refreshResponse = await axios.post(
//           `${import.meta.env.VITE_API_URL}/auth/refresh`,
//           {},
//           { withCredentials: true }
//         );

//         const newAccessToken = refreshResponse.data.accessToken;
//         console.log("NewAcessToken:", newAccessToken);

//         Cookies.set("token", newAccessToken, {
//           path: "/",
//           expires: 7,
//           secure: true,
//           sameSite: "strict",
//         });

//         originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

//         return instance(originalRequest);
//       } catch (refreshError) {
//         Cookies.remove("token");
//         const navigate = useNavigate();
//         navigate("/login");
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default instance;
import axios from "axios";
import Cookies from "js-cookie";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  function (config) {
    const token = Cookies.get("token"); // Lấy token từ Cookies
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Gắn token vào headers Authorization
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response) {
    return response; // Trả về phản hồi nếu thành công
  },
  async function (error) {
    const originalRequest = error.config;

    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const token = Cookies.get("token"); // Lấy token hiện tại từ Cookies

      if (!token) {
        // Điều hướng đến trang login nếu không có token
        // window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        // Gọi API refresh token
        const refreshResponse = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = refreshResponse.data.accessToken; // Lấy accessToken mới từ response
        console.log("NewAccessToken:", newAccessToken);

        // Cập nhật token mới vào Cookies
        Cookies.set("token", newAccessToken, {
          path: "/",
          expires: 7,
          secure: true,
          sameSite: "strict",
        });

        // Gắn token mới vào headers của request ban đầu
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Thực hiện lại request với token mới
        return instance(originalRequest);
      } catch (refreshError) {
        Cookies.remove("token");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
