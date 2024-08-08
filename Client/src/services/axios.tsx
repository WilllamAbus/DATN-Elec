// import axios from "axios";

// const instance = axios.create({
//   baseURL: import.meta.env.VITE_API_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });
// instance.interceptors.request.use(
//   function (config) {
//     const tokenData = window.localStorage.getItem("persist:root");
//     if (tokenData) {
//       try {
//         // Phân tích dữ liệu lưu trữ
//         const parsedToken = JSON.parse(tokenData);
//         if (parsedToken && parsedToken.auth) {
//           const authData = JSON.parse(parsedToken.auth); // Phân tích chuỗi JSON bên trong
//           if (authData && authData.login) {
//             const accessToken = authData.login.token;
//             console.log("Access token:", accessToken);
//             config.headers.Authorization = accessToken
//               ? `Bearer ${accessToken}`
//               : undefined;
//           } else {
//             console.error("Auth data is not in expected format:", authData);
//           }
//         } else {
//           console.error("Token data is not in expected format:", parsedToken);
//         }
//       } catch (e) {
//         console.error("Error parsing token:", e);
//       }
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
//   function (error) {
//     return Promise.reject(error);
//   }
// );

// export default instance;

import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("token");
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
  function (error) {
    return Promise.reject(error);
  }
);

export default instance;
