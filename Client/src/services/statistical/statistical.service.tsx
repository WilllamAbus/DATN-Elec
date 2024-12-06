//http://localhost:4000/api/statistical
// const API_URL = "http://localhost:4000/api/admin/statistical";
import instance from "../axios";

export const topViewProduct = async () => {
  try {
    const response = await instance.get(`/admin/statistical/list`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
export const totalQuantityProduct = async () => {
  try {
    const response = await instance.get(`/admin/statistical/totalProduct`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
export const pendingOrder = async () => {
  try {
    const response = await instance.get(`/admin/statistical/pendingOder`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
export const totalCategories = async () => {
  try {
    const response = await instance.get(`/admin/statistical/totalCate`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
export const totalProductsSold = async () => {
  try {
    const response = await instance.get(`/admin/statistical/productSold`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
export const productCate = async () => {
  try {
    const response = await instance.get(`/admin/statistical/charProduct`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
export const productByCateActive = async () => {
  try {
    const response = await instance.get(`/admin/statistical/productInCateActive`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
export const productByCateDisable = async () => {
  try {
    const response = await instance.get(`/admin/statistical/productInCateDisable`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
export const topComment = async () => {
  try {
    const response = await instance.get(`/admin/statistical/getTopComment`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
export const totalUser = async () => {
  try {
    const response = await instance.get(`/admin/statistical/accCountUser`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
