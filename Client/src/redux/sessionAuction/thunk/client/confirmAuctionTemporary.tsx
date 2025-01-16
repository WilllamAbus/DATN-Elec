import { createAsyncThunk } from "@reduxjs/toolkit";
import { confirmAuctionTemporary } from "../../../../services/AuctionWinsByUser/confirmAuctionTemporary";
import { ConfirmAuctionTemporaryAuctionResponse } from "../../../../services/AuctionWinsByUser/types/confirmAuctionTemporary";

export const confirmAuctionTemporaryThunk = createAsyncThunk<
  ConfirmAuctionTemporaryAuctionResponse,
  { auctionWinnerId: string },
  { rejectValue: { code: string; msg: string } }
>(
  "auctionClient/confirmAuctionTemporary",
  async ({ auctionWinnerId }, { rejectWithValue }) => {
    try {
      const response = await confirmAuctionTemporary(auctionWinnerId);
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
