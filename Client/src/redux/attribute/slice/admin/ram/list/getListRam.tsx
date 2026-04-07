import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getListRamThunk } from "../../../../thunk";
import { Ram, Pagination, ResponseRam } from "../../../../../../services/attribute/types/ram/listRam";

interface ListRamState {
   rams: Ram[];
   status: "idle" | "loading" | "success" | "fail";
   error: string | null;
   pagination: Pagination | null;
   total: number | null;
   countOnPage: number | null;
}

const initialState: ListRamState = {
   rams: [],
   status: "idle",
   error: null,
   pagination: null,
   total: null,
   countOnPage: null,
};

const getListRamSlice = createSlice({
   name: "rams",
   initialState,
   reducers: {},
   extraReducers: (builder) => {
      builder
         .addCase(getListRamThunk.pending, (state) => {
            state.status = "loading";
         })
         .addCase(
            getListRamThunk.fulfilled,
            (state, action: PayloadAction<ResponseRam>) => {
               state.status = "success";
               state.rams = action.payload.data.rams;
               state.pagination = action.payload.pagination;
               state.total = action.payload.data.total;
               state.countOnPage = action.payload.data.countOnPage;
            }
         )
         .addCase(getListRamThunk.rejected, (state, action) => {
            state.status = "fail";
            state.error = (action.payload as string) || "Lỗi không xác định";
         });
   },
});

export default getListRamSlice.reducer;
