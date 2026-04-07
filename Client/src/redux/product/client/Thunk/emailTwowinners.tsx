import { createAsyncThunk } from "@reduxjs/toolkit";
import { emailTwowinners } from "../../../../services/detailProductAuction/emailTwowinners";
import { EmailTwowinnersResponse } from "../../../../services/detailProductAuction/types/emailTwowinners";

export const emailTwowinnerThunk = createAsyncThunk<
  EmailTwowinnersResponse,
  { slug: string },
  { rejectValue: string }
>(
  "auctionClient/emailTwowinners",
  async ({ slug }, { rejectWithValue }) => {
    try {
      if (!slug) {
        return rejectWithValue("Slug là bắt buộc");
      }

      const response = await emailTwowinners(slug);

      if (response.status === "success") {
        return response;
      } else {
        return rejectWithValue(response.message || "Lỗi không xác định");
      }
    } catch (error: any) {
      return rejectWithValue(error.message || "Lỗi không xác định");
    }
  }
);
