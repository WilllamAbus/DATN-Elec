import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { emailTwowinnerThunk } from "../Thunk";
import { EmailTwowinnersResponse, Bidder } from "../../../../services/detailProductAuction/types/emailTwowinners";

interface AuctionEmailState {
  topBidders: Bidder[] | null;
  status: "idle" | "loading" | "success" | "fail";
  error: string | null;
  isLoading: boolean;
}

const initialState: AuctionEmailState = {
  topBidders: null,
  status: "idle",
  error: null,
  isLoading: false,
};

const emailTwowinnerSlice = createSlice({
  name: "auctionClient/emailTwowinners",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(emailTwowinnerThunk.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        emailTwowinnerThunk.fulfilled,
        (state, action: PayloadAction<EmailTwowinnersResponse>) => {
          state.status = "success";
          state.isLoading = false;
          state.topBidders = action.payload.topBidders;
          state.error = null;
        }
      )
      .addCase(emailTwowinnerThunk.rejected, (state, action) => {
        state.status = "fail";
        state.isLoading = false;
        state.error = action.payload || "Lỗi khi gửi email cho 2 người đấu giá cao nhất";
      });
  },
});

export default emailTwowinnerSlice.reducer;
