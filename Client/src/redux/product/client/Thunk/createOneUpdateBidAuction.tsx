import { createAsyncThunk } from "@reduxjs/toolkit";
import { createOneUpdateBidAuction } from "../../../../services/detailProductAuction/createOneUpdateBidAuction";
import { UserBidPriceResponse } from "../../../../services/detailProductAuction/types/userBidPrice";  

export const createOneUpdateBidAuctionThunk = createAsyncThunk<
  UserBidPriceResponse,  // Kiểu trả về khi thành công
  { slug: string; bidPrice: number },  // Tham số truyền vào
  { rejectValue: UserBidPriceResponse }  // Kiểu của giá trị trả về khi thất bại
>(
  "productClient/createOneUpdateBidAuction",
  async ({ slug, bidPrice }, { rejectWithValue }) => {
    try {
      const response = await createOneUpdateBidAuction(slug, bidPrice);

      if (response.success) {
        return response;
      } else {
        return rejectWithValue(response);  // Trả về toàn bộ response khi thất bại
      }
    } catch (error: any) {
      return rejectWithValue({ msg: error.message || "Lỗi không xác định", success: false, err: 1, status: "fail" });
    }
  }
);

