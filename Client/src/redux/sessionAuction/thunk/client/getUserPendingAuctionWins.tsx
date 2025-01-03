import { createAsyncThunk } from "@reduxjs/toolkit";
import { getUserPendingAuctionWins } from "../../../../services/AuctionWinsByUser/getUserPendingAuctionWin";
import { AuctionWinResponse } from "../../../../services/AuctionWinsByUser/types/getUserPendingAuctionWin";

export const getUserPendingAuctionWinsThunk = createAsyncThunk<
  AuctionWinResponse,
  void,
  { rejectValue: { code: string; msg: string } }
>(
  "auctionClient/getUserPendingAuctionWins",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserPendingAuctionWins();
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
