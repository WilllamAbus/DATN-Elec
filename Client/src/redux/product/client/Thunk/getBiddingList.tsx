import { createAsyncThunk } from "@reduxjs/toolkit";
import { getBiddingList } from "../../../../services/detailProductAuction/getBiddingList";
import { BiddingListResponse } from "../../../../services/detailProductAuction/types/getBiddingList";

export const getBiddingListThunk = createAsyncThunk<
  BiddingListResponse,
  { slug: string; page: number; limit?: number },
  { rejectValue: string }
>(
  "auctionClient/getBiddingList",
  async ({ slug, page, limit = 1 }, { rejectWithValue }) => {
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
