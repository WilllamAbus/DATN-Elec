import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { listProductAuctionThunk } from "../Thunk";
import { LimitProductAuctionResponse,ProductAuction,Pagination} from "../../../../services/productAuction/types/listProductAuction";

interface ProductState {
  products: ProductAuction[];
  status: "idle" | "loading" | "success" | "fail";
  error: string | null;
  pagination: Pagination | null;
  total: number | null;
}

const initialState: ProductState = {
  products: [],
  status: "idle",
  error: null,
  pagination: null,
  total: null
};

const LimitProductAuctionSlice = createSlice({
  name: "products/paginated",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(listProductAuctionThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        listProductAuctionThunk.fulfilled,
        (state, action: PayloadAction<LimitProductAuctionResponse>) => {
          state.status = "success";
          state.products = action.payload.data.products;
          state.pagination = action.payload.pagination;
          state.total = action.payload.data.total;
        }
      )
      .addCase(listProductAuctionThunk.rejected, (state, action) => {
        console.error("Error payload:", action.payload);
        state.status = "fail";
        state.error = typeof action.payload === 'string' ? action.payload : "Lỗi không xác định";
      });
      
  },
});

export default LimitProductAuctionSlice.reducer;
