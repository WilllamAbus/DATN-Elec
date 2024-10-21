import { createAsyncThunk } from "@reduxjs/toolkit";
import { updateProductAuction } from "../../../../services/productAuction/admin/update";
import { reponseProduct, ProductAuction } from "../../../../services/product_v2/admin/types/add-product-auction";

export const updateAuctionThunk = createAsyncThunk<
  reponseProduct, 
  { id: string; product: ProductAuction },
  { rejectValue: reponseProduct } 
>(
  "product/pdateAuction",
  async ({ id, product }, { rejectWithValue }) => {
    try {
      const response = await updateProductAuction(id, product);
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
        msg: "Lỗi khi cập nhật sản phẩm",
        status: 500,
      });
    }
  }
);
