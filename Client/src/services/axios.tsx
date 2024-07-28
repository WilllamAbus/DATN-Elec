import axios from "axios";

console.log("Axios instance configuration");

console.log(import.meta.env.VITE_API_URL);

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

instance.interceptors.request.use(
  function (config) {
    const token = window.localStorage.getItem("persist:root");
    console.log("Stored token:", token);

    if (token) {
      try {
        const parsedToken = JSON.parse(token);
        const accessToken = JSON.parse(parsedToken.login)?.currentUser?.accessToken;
        console.log("Access token:", accessToken);
        config.headers.Authorization = accessToken ? `Bearer ${accessToken}` : undefined;
      } catch (e) {
        console.error("Error parsing token:", e);
      }
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
const storedToken = window.localStorage.getItem("persist:root");
console.log("Stored token:", storedToken);
if (storedToken) {
  try {
    const parsedToken = JSON.parse(storedToken);
    console.log("Parsed token:", parsedToken);
    const loginData = JSON.parse(parsedToken.login);
    console.log("Login data:", loginData);
    console.log("Access token:", loginData?.currentUser?.accessToken);
  } catch (e) {
    console.error("Error parsing token:", e);
  }
}

// Thêm một bộ đón chặn response
instance.interceptors.response.use(
  function (response) {
    // Bất kì mã trạng thái nào nằm trong tầm 2xx đều khiến hàm này được trigger
    // Làm gì đó với dữ liệu response
    return response;
  },
  function (error) {
    // Bất kì mã trạng thái nào lọt ra ngoài tầm 2xx đều khiến hàm này được trigger
    // Làm gì đó với lỗi response
    return Promise.reject(error);
  }
);
console.log('Firebase API Key:', import.meta.env.VITE_APP_FIREBASE_API_KEY);

export default instance;
