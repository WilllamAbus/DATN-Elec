// import axios from "axios";
// import Cookies from "js-cookie";
// import { useNavigate } from "react-router-dom";
// const navigate = useNavigate();
// const instance = axios.create({
//   baseURL: import.meta.env.VITE_API_URL,
//   withCredentials: true,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// instance.interceptors.request.use(
//   function (config) {
//     const token = localStorage.getItem("token");
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
//         // localStorage.setItem("token", newAccessToken);
//         originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

//         return instance(originalRequest);
//       } catch (refreshError) {
//         Cookies.remove("token");
//         Cookies.remove("refreshToken");
//         navigate("/login");
//         window.location.href = "/login";
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default instance;
// import axios from "axios";
// import Cookies from "js-cookie";
// import { useNavigate } from "react-router-dom";

// // Tạo instance axios
// const instance = axios.create({
//   baseURL: import.meta.env.VITE_API_URL,
//   withCredentials: true,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// instance.interceptors.request.use(
//   function (config) {
//     const token = Cookies.get("token"); // Sử dụng Cookies để lấy token
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
//         Cookies.remove("token");
//         const navigate = useNavigate();
//         navigate("/login");
//         // window.location.href = "/login"; // Sử dụng window.location.href để điều hướng
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default instance;
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
