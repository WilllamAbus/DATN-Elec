import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  function (config) {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;

    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const token = Cookies.get("token");
      if (!token) {
        const navigate = useNavigate();
        navigate("/login");
        return Promise.reject(error);
      }
      try {
        const refreshResponse = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = refreshResponse.data.accessToken;
        console.log("NewAcessToken:", newAccessToken);

        Cookies.set("token", newAccessToken, {
          path: "/",
          expires: 7,
          secure: true,
          sameSite: "strict",
        });

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return instance(originalRequest);
      } catch (refreshError) {
        Cookies.remove("token");
        const navigate = useNavigate();
        navigate("/login");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
// import axios from "axios";
// import Cookies from "js-cookie";

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
//         // Xóa localStorage khi không có token

//         localStorage.removeItem("persist:root");

//         // Điều hướng tới trang login
//         window.location.href = "/";
//         return Promise.reject(error);
//       }

//       try {
//         // Gọi API để làm mới token
//         const refreshResponse = await axios.post(
//           `${import.meta.env.VITE_API_URL}/auth/refresh`,
//           {},
//           { withCredentials: true }
//         );

//         const newAccessToken = refreshResponse.data.accessToken;
//         console.log("NewAccessToken:", newAccessToken);

//         // Cập nhật token mới vào cookies
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

//         localStorage.removeItem("persist:root");
//         window.location.href = "/";
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default instance;
// import axios from "axios";
// import Cookies from "js-cookie";

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
//         // Token không tồn tại => Xóa localStorage và điều hướng tới trang login
//         Cookies.remove("token");

//         window.location.href = "/login";

//         return Promise.reject(error);
//       }

//       try {
//         const refreshResponse = await axios.post(
//           `${import.meta.env.VITE_API_URL}/auth/refresh`,
//           {},
//           { withCredentials: true }
//         );

//         const newAccessToken = refreshResponse.data.accessToken;

//         Cookies.set("token", newAccessToken, {
//           path: "/",
//           expires: 7,
//           secure: true,
//           sameSite: "strict",
//         });

//         originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//         return instance(originalRequest);
//       } catch (refreshError) {
//         // Refresh token thất bại, xóa token và localStorage
//         Cookies.remove("token");
//         // if (window.location.pathname !== "/login") {
//         window.location.href = "/login";
//         // }
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default instance;
