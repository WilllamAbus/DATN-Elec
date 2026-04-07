import { createAsyncThunk } from "@reduxjs/toolkit";
import { addProduct } from "../../../../services/product_v2/admin";
import { reponseProduct, Product } from "../../../../services/product_v2/admin/types/add-product";

export const add = createAsyncThunk<
  reponseProduct, 
  Product,  
  { rejectValue: reponseProduct }  
>(
  "product/add",
  async (productData, { rejectWithValue }) => {
    try {
      const response = await addProduct(productData);
      if (response.success) {
        return response; 
      } else {
        return rejectWithValue({
          success: false,
          err: response.err,
          msg: response.msg,
          status: response.status,
        });
      }
    } catch (error) {
      return rejectWithValue({
        success: false,
        err: 1,
        msg: "Lỗi thêm hong có được mà",
        status: 500,
      });
    }
  }
);
