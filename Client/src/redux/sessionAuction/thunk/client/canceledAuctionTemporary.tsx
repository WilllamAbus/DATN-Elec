import { createAsyncThunk } from "@reduxjs/toolkit";
import { canceledAuctionTemporary } from "../../../../services/AuctionWinsByUser/canceledAuctionTemporary";
import { CanceledAuctionTemporaryResponse } from "../../../../services/AuctionWinsByUser/types/canceledAuctionTemporary";

export const canceledAuctionTemporaryThunk = createAsyncThunk<
  CanceledAuctionTemporaryResponse,
  { auctionWinnerId: string },
  { rejectValue: { code: string; msg: string } }
>(
  "auctionClient/canceledAuctionTemporary",
  async ({ auctionWinnerId }, { rejectWithValue }) => {
    try {
      const response = await canceledAuctionTemporary(auctionWinnerId);
      if (response.code === "THANH_CONG") {
        return response;
      } else {
        return rejectWithValue({ code: response.code, msg: response.msg });
      }
    } catch (error: any) {
      return rejectWithValue({ code: error.code || "LOI_KHONG_XAC_DINH", msg: error.msg || "Lỗi không xác định" });
    }
  }
);
