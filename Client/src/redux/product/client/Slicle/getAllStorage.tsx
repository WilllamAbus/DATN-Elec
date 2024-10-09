import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAllStorageThunk } from "../Thunk"; 
import { GetAllStorageResponse, initialStorageState } from "../../../../services/product_v2/types/attributes/getAllStorage";

const getAllStorageSlice = createSlice({
  name: "storageClient/getAllStorage",
  initialState: initialStorageState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllStorageThunk.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
      })
      .addCase(
        getAllStorageThunk.fulfilled,
        (state, action: PayloadAction<GetAllStorageResponse>) => {
          state.status = "success";
          state.isLoading = false;
          state.storages = action.payload.storages;
        }
      )
      .addCase(getAllStorageThunk.rejected, (state, action) => {
        state.status = "fail"; 
        state.isLoading = false;
        state.error = action.payload as string || "Lỗi không xác định";
      });
  },
});

export default getAllStorageSlice.reducer;
