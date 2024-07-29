import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchProductsThunk,
  fetchProductByIdThunk,
  createProductThunk,
  updateProductThunk,
  deleteProductThunk,
} from "./productsThunk";
import { Product } from "../../types/Products.d";

interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  message: string | null;
}

const initialState: ProductState = {
  products: [],
  selectedProduct: null,
  status: "idle",
  error: null,
  message: null,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductsThunk.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.status = "succeeded";
        state.products = action.payload;
        state.message = null;
      })
      .addCase(fetchProductsThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch products";
        state.message = null;
      })
      .addCase(fetchProductByIdThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductByIdThunk.fulfilled, (state, action: PayloadAction<Product>) => {
        state.status = "succeeded";
        state.selectedProduct = action.payload;
        state.message = null;
      })
      .addCase(fetchProductByIdThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch product";
        state.message = null;
      })
      .addCase(createProductThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createProductThunk.fulfilled, (state, action: PayloadAction<{ message: string; product: Product }>) => {
        state.status = "succeeded";
        state.products.push(action.payload.product);
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(createProductThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
        state.message = null;
      })
      .addCase(updateProductThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateProductThunk.fulfilled, (state, action: PayloadAction<Product>) => {
        state.status = "succeeded";
        state.products = state.products.map((product) =>
          product._id === action.payload._id ? action.payload : product
        );
        state.message = null;
      })
      .addCase(updateProductThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
        state.message = null;
      })
      .addCase(deleteProductThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteProductThunk.fulfilled, (state, action: PayloadAction<{ _id: string }>) => {
        state.status = "succeeded";
        state.products = state.products.filter((product) => product._id !== action.payload._id);
        state.message = null;
        state.error = null;
      })
      .addCase(deleteProductThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to delete product";
        state.message = null;
      });
  },
});

export default productsSlice.reducer;
