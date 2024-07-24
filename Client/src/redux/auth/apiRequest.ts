// import axios from "axios";
// import { loginFailed, loginStart, loginSuccess } from "./authSlice";
// import { AppDispatch } from "../../redux/store";

// const API_URL = import.meta.env.VITE_API_URL;

// export const loginUser = async (
//   user: {
//     email: string;
//     password: string;
//   },
//   dispatch: AppDispatch,
//   navigate: (path: string) => void
// ) => {
//   dispatch(loginStart());
//   try {
//     const res = await axios.post(`${API_URL}/auth/login`, user);
//     dispatch(loginSuccess(res.data));
//     navigate("/");
//   } catch (err: any) {
//     dispatch(loginFailed());
//   }
// };
import axios from "axios";
import { Cookies } from "react-cookie";

const BASE_URL = import.meta.env.VITE_API_URL;

const request = async ({
  method = "GET",
  path = "",
  data = {},
  headers = {},
}) => {
  try {
    const cookie = new Cookies();
    const token = cookie.get("token");

    const res = await axios({
      method: method,
      baseURL: BASE_URL,
      url: path,
      data: data,
      headers: {
        Authorization: `Bearer ${token}`,
        ...headers,
      },
    });

    return res.data;
  } catch (err) {
    alert(err?.response?.data?.message);
    return null;
  }
};

export default request;
