import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getListScreenThunk } from "../../../../thunk";
import { Screen, Pagination, ResponseScreen } from "../../../../../../services/attribute/types/screen/listScreen";

interface ListScreenState {
   screens: Screen[];
   status: "idle" | "loading" | "success" | "fail";
   error: string | null;
   pagination: Pagination | null;
   total: number | null;
   countOnPage: number | null;
}

const initialState: ListScreenState = {
   screens: [],
   status: "idle",
   error: null,
   pagination: null,
   total: null,
   countOnPage: null,
};

const getListScreenSlice = createSlice({
   name: "screens",
   initialState,
   reducers: {},
   extraReducers: (builder) => {
      builder
         .addCase(getListScreenThunk.pending, (state) => {
            state.status = "loading";
         })
         .addCase(
            getListScreenThunk.fulfilled,
            (state, action: PayloadAction<ResponseScreen>) => {
               state.status = "success";
               state.screens = action.payload.data.screens;
               state.pagination = action.payload.pagination;
               state.total = action.payload.data.total;
               state.countOnPage = action.payload.data.countOnPage;
            }
         )
         .addCase(getListScreenThunk.rejected, (state, action) => {
            state.status = "fail";
            state.error = (action.payload as string) || "Lỗi không xác định";
         });
   },
});

export default getListScreenSlice.reducer;
