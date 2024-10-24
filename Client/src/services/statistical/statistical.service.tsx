//http://localhost:4000/api/statistical
const API_URL = "http://localhost:4000/api/admin/statistical";
import instance from "../axios";

export const topViewProduct = async () => {
  try {
    const response = await instance.get(`${API_URL}/list`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
export const totalQuantityProduct = async () => {
  try {
    const response = await instance.get(`${API_URL}/totalProduct`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
export const pendingOrder = async () => {
  try {
    const response = await instance.get(`${API_URL}/pendingOder`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
export const totalCategories = async () => {
  try {
    const response = await instance.get(`${API_URL}/totalCate`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
export const totalProductsSold = async () => {
  try {
    const response = await instance.get(`${API_URL}/productSold`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
export const productCate = async () => {
  try {
    const response = await instance.get(`${API_URL}/charProduct`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
export const productByCateActive = async () => {
  try {
    const response = await instance.get(`${API_URL}/productInCateActive`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
export const productByCateDisable = async () => {
  try {
    const response = await instance.get(`${API_URL}/productInCateDisable`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
