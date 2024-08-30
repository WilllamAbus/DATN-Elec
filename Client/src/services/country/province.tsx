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
