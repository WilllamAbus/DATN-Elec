import { createAsyncThunk } from "@reduxjs/toolkit";
import { canceledAuction } from "../../../../services/AuctionWinsByUser/canceledAuction";
import { AuctionCanceledResponse } from "../../../../services/AuctionWinsByUser/types/canceledAuction";

export const canceledAuctionThunk = createAsyncThunk<
  AuctionCanceledResponse,
  { auctionWinnerId: string },
  { rejectValue: { code: string; msg: string } }
>(
  "auctionClient/canceledAuction",
  async ({ auctionWinnerId }, { rejectWithValue }) => {
    try {
      const response = await canceledAuction(auctionWinnerId);
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
