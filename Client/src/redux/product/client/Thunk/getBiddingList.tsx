import { createAsyncThunk } from "@reduxjs/toolkit";
import { getBiddingList } from "../../../../services/detailProductAuction/getBiddingList";
import { BiddingListResponse } from "../../../../services/detailProductAuction/types/getBiddingList";
import { RootState } from "../../../store";

// Thunk để lấy danh sách đấu giá
export const getBiddingListThunk = createAsyncThunk<
  BiddingListResponse,
  { slug: string; page: number; limit?: number },
  { rejectValue: string; state: RootState }
>(
  "auctionClient/getBiddingList",
  async ({ slug, page, limit = 5 }, { rejectWithValue }) => {
    try {
      if (!slug) {
        return rejectWithValue("Slug is required");
      }
      const response = await getBiddingList(slug, page, limit);
      if (response.success) {
        return response;
      } else {
        return rejectWithValue(response.msg || "Failed to fetch bidding list");
      }
    } catch (error: any) {
      return rejectWithValue(error.message || "Unknown error occurred");
    }
  }
);
