import { createAsyncThunk } from "@reduxjs/toolkit";
import { checkAuctionTime } from "../../../../services/detailProductAuction/checkAuctionTime";
import { CheckAuctionTimeResponse } from "../../../../services/detailProductAuction/types/checkAuctionTime";

export const checkAuctionTimeThunk = createAsyncThunk<
  CheckAuctionTimeResponse,
  string, // Dữ liệu đầu vào của thunk là slug (string)
  { rejectValue: { code: string; msg: string } }
>(
  "auctionClient/checkAuctionTime",
  async (slug, { rejectWithValue }) => {
    try {
      const response = await checkAuctionTime(slug);
      return response;
    } catch (error: any) {
      return rejectWithValue({ code: error.code || "LOI_KHONG_XAC_DINH", msg: error.msg || "Lỗi không xác định" });
    }
  }
);
