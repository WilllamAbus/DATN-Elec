import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addImageVariantThunk  } from "../Thunk/addImageVariant";
import { ImageVariantResponse, initialImageVariantState } from "../../../../services/product_v2/admin/types/imageVariant";

const addImageVariantSlice = createSlice({
  name: "imageVariant/add",
  initialState: initialImageVariantState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addImageVariantThunk .pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
      })
      .addCase(addImageVariantThunk .fulfilled, (state, action: PayloadAction<ImageVariantResponse>) => {
        state.status = "success";
        state.isLoading = false;
        if (action.payload.imageVariant) {
          state.imageVariants.push(action.payload.imageVariant);
        }
        state.error = null;
        console.log(action.payload.msg);
      })
      .addCase(addImageVariantThunk .rejected, (state, action) => {
        state.status = "fail";
        state.isLoading = false;
        const errorPayload = action.payload as ImageVariantResponse;
        state.error = errorPayload?.msg || "Lỗi thêm biến thể hình ảnh không thành công";
        console.log(errorPayload?.msg);
      });
  },
});

export default addImageVariantSlice.reducer;
