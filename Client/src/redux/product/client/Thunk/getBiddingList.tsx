import { createAsyncThunk } from "@reduxjs/toolkit";
import { getBiddingList, getAuctionWinner } from "../../../../services/detailProductAuction/getBiddingList";
import { BiddingListResponse, AuctionWinner } from "../../../../services/detailProductAuction/types/getBiddingList";

// Thunk để lấy danh sách đấu giá
export const getBiddingListThunk = createAsyncThunk<
  BiddingListResponse,
  { slug: string; page: number; limit?: number },
  { rejectValue: string }
>(
  "auctionClient/getBiddingList",
  async ({ slug, page, limit = 5 }, { rejectWithValue }) => {
    try {
      if (!slug) {
        return rejectWithValue("Slug là bắt buộc");
      }

      const response = await getBiddingList(slug, page, limit);

      if (response.success) {
        return response;
      } else {
        return rejectWithValue(response.msg);
      }
    } catch (error: any) {
      return rejectWithValue(error.message || "Lỗi không xác định");
    }
  }
);

// Thunk để lấy thông tin người thắng cuộc
export const getAuctionWinnerThunk = createAsyncThunk<
  AuctionWinner,
  { slug: string },
  { rejectValue: string }
>(
  "auctionClient/getAuctionWinner",
  async ({ slug }, { rejectWithValue }) => {
    try {
      if (!slug) {
        return rejectWithValue("Slug là bắt buộc");
      }

      const response = await getAuctionWinner(slug);

      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Lỗi không xác định");
    }
  }
);
