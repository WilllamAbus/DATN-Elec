import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAllStorageBySlugUrlThunk } from "../Thunk";
import { GetAllStorageBySlugUrlResponse } from "../../../../services/detailProduct/types/getAllStorageBySlugUrl";

interface StorageState {
  storageList: GetAllStorageBySlugUrlResponse['data'] | null;
  status: "idle" | "loading" | "success" | "fail";
  error: string | null;
  isLoading: boolean;
}

const initialState: StorageState = {
  storageList: null,
  status: "idle",
  error: null,
  isLoading: false,
};

const getAllStorageBySlugUrlSlice = createSlice({
  name: "productClient/getAllStorageBySlugUrl",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllStorageBySlugUrlThunk.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getAllStorageBySlugUrlThunk.fulfilled,
        (state, action: PayloadAction<GetAllStorageBySlugUrlResponse>) => {
          state.status = "success";
          state.isLoading = false;
          state.storageList = action.payload.data;
          state.error = null;
        }
      )
      .addCase(getAllStorageBySlugUrlThunk.rejected, (state, action) => {
        state.status = "fail";
        state.isLoading = false;
        state.error = action.payload || "Error fetching storage list";
      });
  },
});

export default getAllStorageBySlugUrlSlice.reducer;
