import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAllBatteryThunk } from "../Thunk";
import { GetAllBatteryResponse, initialBatteryState } from "../../../../services/product_v2/types/attributes/getAllBattery";

const getAllBatterySlice = createSlice({
  name: "batteryClient/getAllBattery",
  initialState: initialBatteryState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllBatteryThunk.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
      })
      .addCase(
        getAllBatteryThunk.fulfilled,
        (state, action: PayloadAction<GetAllBatteryResponse>) => {
          state.status = "success"; 
          state.isLoading = false;
          state.batteries = action.payload.batteries; 
        }
      )
      .addCase(getAllBatteryThunk.rejected, (state, action) => {
        state.status = "fail"; 
        state.isLoading = false;
        state.error = action.payload as string || "Lỗi không xác định";
      });
  },
});

export default getAllBatterySlice.reducer;
