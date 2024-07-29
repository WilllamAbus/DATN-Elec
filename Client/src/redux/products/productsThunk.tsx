import { createAsyncThunk } from "@reduxjs/toolkit";
import instance from "../../services/axios";
import { Product } from "../../types/Products.d";

const API_URL = import.meta.env.VITE_API_URL;

export const fetchProductsThunk = createAsyncThunk<Product[]>(
  "products/fetchProducts",
  async () => {
    const response = await instance.get(`${API_URL}/product`);
    return response.data;
  }
);

export const fetchProductByIdThunk = createAsyncThunk<Product, string>(
  "products/fetchProductById",
  async (productId) => {
    const response = await instance.get(`${API_URL}/product/${productId}`);
    return response.data;
  }
);

export const createProductThunk = createAsyncThunk(
  "products/createProduct",
  async (productData: FormData, thunkAPI) => {
    try {
      const response = await instance.post(`${API_URL}/product/add`, productData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue((error as Error).message);
    }
  }
);

export const updateProductThunk = createAsyncThunk<Product, Product>(
  "products/updateProduct",
  async (product) => {
    const response = await instance.put(`${API_URL}/product/${product._id}`, product);
    return response.data;
  }
);

export const deleteProductThunk = createAsyncThunk<{ _id: string }, string>(
  "products/deleteProduct",
  async (productId) => {
    await instance.delete(`${API_URL}/product/${productId}`);
    return { _id: productId };
  }
);
