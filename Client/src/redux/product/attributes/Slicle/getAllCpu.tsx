import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAllCpuThunk } from "../Thunk";  
import { GetAllCpuResponse, initialCpuState } from "../../../../services/product_v2/types/attributes/getAllCpu";

const getAllCpuSlice = createSlice({
  name: "cpuClient/getAllCpu",
  initialState: initialCpuState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllCpuThunk.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
      })
      .addCase(
        getAllCpuThunk.fulfilled,
        (state, action: PayloadAction<GetAllCpuResponse>) => {
          state.status = "success"; 
          state.isLoading = false;
          state.cpus = action.payload.cpus; 
        }
      )
      .addCase(getAllCpuThunk.rejected, (state, action) => {
        state.status = "fail"; 
        state.isLoading = false;
        state.error = action.payload as string || "Lỗi không xác định";
      });
  },
});

export default getAllCpuSlice.reducer;
