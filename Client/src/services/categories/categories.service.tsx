// src/services/apiService.ts

import { environment } from "../../environments/environment.prod";
import { Category } from "../../types/Categories.d";
import axiosInstance from "../axios";
const API_BASE_URL = `${environment.url}`;
export interface ApiResponse {
  data: Category[];
}
export const checkCategoryExists = async (name: any) => {
  const response = await axiosInstance.get(`/checkCategory/${name}`);
  return response.data.exists;
};
export const createCategory = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post(`${API_BASE_URL}/addCate`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    return response.data; 
  } catch (error) {
    throw new Error(
      (error as { response?: { data?: { message?: string } } })?.response?.data
        ?.message || "Failed to create category"
    );
  }
};

export const getAllCategories = async (): Promise<Category[]> => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/getAllCate`);
    console.log('Fetched data:', response); // Log data to verify
    return response.data;
  } catch (error: any) {
    throw new Error(`Error fetching categories: ${error.message}`);
  }
};

export const getCategoryById = async (id: string): Promise<Category> => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/getCate/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(`Error fetching category: ${error.message}`);
  }
};

export const updateCategory = async (
  id: string,
  formData: FormData
): Promise<Category> => {
  try {
    const response = await axiosInstance.put(
      `${API_BASE_URL}/updateCate/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      (error as { response?: { data?: { message?: string } } })?.response?.data
        ?.message || "Failed to update category"
    );
  }
};

export const updateCategoryService = async (id: string, formData: FormData) => {
  try {
    const response = await axiosInstance.put(
      `http://localhost:4000/api/categories/updateCate/${id}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      (error as { response?: { data?: { message?: string } } })?.response?.data
        ?.message || "Failed to update category"
    );
  }
};

export const deleteCategory = async (
  _id: string
): Promise<{ message: string }> => {
  try {
    const response = await axiosInstance.delete(
      `${API_BASE_URL}/delete/${_id}`
    );
    return response.data;
  } catch (error: any) {
    throw new Error(`Error deleting category: ${error.message}`);
  }
};


export const sofDeleteCategory = async (_id: string): Promise<Category> => {
  try {
    const response = await axiosInstance.patch(`/soft-delete/${_id}`);
    return response.data;  // Assume this returns the updated Category object
  } catch (error: any) {
    throw new Error(`Error deleting category: ${error.message}`);
  }
};

export const deleteListCate = async (): Promise<ApiResponse> => {
  // Replace this with your actual API call
  const response = await axiosInstance.get('/deleted-list');
  const data = response.data.data; // Adjust this if the actual path is different

  // Log the data to debug the response structure
  console.log('API response data:', data);

  if (!Array.isArray(data)) {
    console.error('Expected data to be an array, but received:', data);
    return { data: [] }; // Return an empty array on unexpected data
  }

  return { data };// Ensure this matches the ApiResponse type
};

export const restore = async (_id: string): Promise<Category> => {
  try {
    const response = await axiosInstance.patch(`/restore/${_id}`);
    return response.data;  // Assume this returns the restored Category object
  } catch (error: any) {
    throw new Error(`Error restoring category: ${error.message}`);
  }
};