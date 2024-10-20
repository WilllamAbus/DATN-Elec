import { createAsyncThunk } from "@reduxjs/toolkit";
import { addProductAuction } from "../../../../services/productAuction/admin/add";
import { reponseProduct, ProductAuction } from "../../../../services/product_v2/admin/types/add-product-auction";

export const addProductAuctionThunk = createAsyncThunk<
  reponseProduct, 
  ProductAuction,  
  { rejectValue: reponseProduct }  
>(
  "product/add-auction",
  async (productData, { rejectWithValue }) => {
    try {
      const response = await addProductAuction(productData);
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
