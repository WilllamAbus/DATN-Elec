import { createAsyncThunk } from "@reduxjs/toolkit";
import { confirmAuction } from "../../../../services/AuctionWinsByUser/confirmAuction";
import { ConfirmAuctionResponse } from "../../../../services/AuctionWinsByUser/types/confirmAuction";

export const confirmAuctionThunk = createAsyncThunk<
  ConfirmAuctionResponse,
  { auctionWinnerId: string },
  { rejectValue: { code: string; msg: string } }
>(
  "auctionClient/confirmAuction",
  async ({ auctionWinnerId }, { rejectWithValue }) => {
    try {
      const response = await confirmAuction(auctionWinnerId);
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
