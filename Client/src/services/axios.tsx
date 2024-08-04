// import axios from "axios";

// const instance = axios.create({
//   baseURL: import.meta.env.VITE_API_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// instance.interceptors.request.use(
//   function (config) {
//     const token = window.localStorage.getItem("persist:root");
//     if (token) {
//       try {
//         const parsedToken = JSON.parse(token);
//         const authData = JSON.parse(parsedToken.auth);
//         const accessToken = authData?.login?.token;
//         console.log("Access token:", accessToken);
//         config.headers.Authorization = accessToken
//           ? `Bearer ${accessToken}`
//           : undefined;
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

export default instance;
