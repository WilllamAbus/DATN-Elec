import axios from "axios";
import { Cookies } from "react-cookie";

const BASE_URL = "http://localhost:4000/api/";

const request = async ({
  method = "GET",
  path = "",
  data = {},
  headers = {},
}) => {
  try {
    const cookie = new Cookies();
    const token = cookie.get("token");

    // console.log("Request Details:", {
    //   method: method,
    //   baseURL: BASE_URL,
    //   url: path,
    //   data: data,
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //     ...headers,
    //   },
    // });

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
    if (axios.isAxiosError(err) && err.response) {
      throw {
        status: err.response.status,
        statusText: err.response.statusText,
        data: err.response.data,
      };
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};
//   } catch (err) {
//     console.error("Error in request:", err);
//     alert("Dăng nhập hết hạn");
//     // window.location.href = "/";
//     return null;
//   }
// };

export default request;
