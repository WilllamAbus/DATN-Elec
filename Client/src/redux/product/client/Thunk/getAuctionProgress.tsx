import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAuctionProgress } from "../../../../services/detailProductAuction/getAuctionProgress";
import { GetAuctionProgressResponse } from "../../../../services/detailProductAuction/types/getAuctionProgress";

export const getAuctionProgressThunk = createAsyncThunk<
  GetAuctionProgressResponse,
  { slug: string; page: number },
  { rejectValue: { code: string; msg: string } }
>(
  "auctionClient/getAuctionProgress",
  async ({ slug, page }, { rejectWithValue }) => {
    try {
      const response = await getAuctionProgress(slug, page);
      if (response.success) {
        return response;
      } else {
        return rejectWithValue({ code: response.err.toString(), msg: response.msg });
      }
    } catch (error: any) {
      return rejectWithValue({ code: error.code || "LOI_KHONG_XAC_DINH", msg: error.msg || "Lỗi không xác định" });
    }
  }
);
