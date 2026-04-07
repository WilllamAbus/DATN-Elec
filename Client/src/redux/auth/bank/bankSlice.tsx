import { createSlice } from "@reduxjs/toolkit";

import { Bank } from "../../../types/user";
import {
  addBankThunk,
  deleteBankThunk,
  getBanks,
  listBankThunk,
  // setDefaultBankThunk,
} from "./bankThunk";
interface BankState {
  banks: Bank[];
  data: Bank[];
  loading: boolean;
  error: string | null;
}
const initialState: BankState = {
  banks: [],
  data: [],
  loading: false,
  error: null,
};
const bankSlice = createSlice({
  name: "bank",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getBanks.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBanks.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getBanks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Đã có lỗi xảy ra";
      })
      .addCase(addBankThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(addBankThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.banks.push(action.payload);
      })
      .addCase(addBankThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Lỗi khi thêm ngân hàng";
      })
      .addCase(listBankThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(listBankThunk.fulfilled, (state, action) => {
        state.loading = false;
        console.log("Fetched carts:", action.payload.banks);
        state.banks = action.payload.banks;
      })

      .addCase(listBankThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Cập nhật giỏ hàng thất bại";
      })
      .addCase(deleteBankThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBankThunk.fulfilled, (state, action) => {
        state.loading = false;

        const Bankid = action.meta.arg;

        state.banks = state.banks.filter((bank) => bank._id !== Bankid);
      })

      .addCase(deleteBankThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    // .addCase(setDefaultBankThunk.pending, (state) => {
    //   state.loading = true;
    //   state.error = null;
    // })

    // .addCase(setDefaultBankThunk.fulfilled, (state, action) => {
    //   const setDefaultBank = action.meta.arg;

    //   state.banks = state.banks.map((bank) => ({
    //     ...bank,
    //     isDefault: bank._id === setDefaultBank,
    //   }));
    // })

    // .addCase(setDefaultBankThunk.rejected, (state, action) => {
    //   state.loading = false;
    //   state.error = action.payload as string;
    // });
  },
});

// Export reducer và các actions cần thiết
export default bankSlice.reducer;
