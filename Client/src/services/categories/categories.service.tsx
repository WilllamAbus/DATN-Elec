// src/services/apiService.ts

import { environment } from "../../environments/environment.prod";
import { Category } from "../../types/Categories.d";
import axiosInstance from "../axios";
const API_BASE_URL = `${environment.url}`;

export const createCategory = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post(
      `${API_BASE_URL}/addCate`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
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
