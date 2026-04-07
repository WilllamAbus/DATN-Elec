import axios from "axios";
const API_URL = "https://esgoo.net/api-tinhthanh";

export const getProvinces = async () => {
  const response = await axios.get(`${API_URL}/1/0.htm`);
  return response.data; // Giả sử dữ liệu trả về chứa cả ID và tên
};

export const getDistricts = async (provinceId: string) => {
  const response = await axios.get(`${API_URL}/2/${provinceId}.htm`);
  return response.data; // Giả sử dữ liệu trả về chứa cả ID và tên
};

export const getWards = async (districtId: string) => {
  const response = await axios.get(`${API_URL}/3/${districtId}.htm`);
  return response.data; // Giả sử dữ liệu trả về chứa cả ID và tên
};
// api/countryApi.ts

// import axios from "axios";

// const API_URL = "https://vapi.vnappmob.com/api/province";

// export const getProvinces = async () => {
//   const response = await axios.get(`${API_URL}/`);
//   return response.data; // Dữ liệu từ API chứa trường results
// };

// export const getDistricts = async (provinceId: string) => {
//   const response = await axios.get(`${API_URL}/district/${provinceId}`);
//   return response.data; // Dữ liệu từ API chứa trường results
// };

// export const getWards = async (districtId: string) => {
//   const response = await axios.get(`${API_URL}/ward/${districtId}`);
//   return response.data; // Dữ liệu từ API chứa trường results
// };
