import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { editPostThunk } from "../../../thunk/admin/edit/editPost"; 
import { responsePost, initialPostState } from "../../../../../services/post/admin/types/post"; 

const editPostSlice = createSlice({
  name: "post/edit",
  initialState: initialPostState, 
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(editPostThunk.pending, (state) => {
        state.status = "loading";
        state.isLoading = true; 
      })
      .addCase(editPostThunk.fulfilled, (state, action: PayloadAction<responsePost>) => {
        state.status = "success";
        state.isLoading = false;
        if (action.payload.post) {
          const index = state.posts.findIndex(
            (p) => p._id === action.payload.post?._id
          );
          // Cập nhật thông tin bài viết trong danh sách
          if (index !== -1) {
            state.posts[index] = action.payload.post;
          }
        }
        state.error = null;
        console.log(action.payload.msg);
      })
      .addCase(editPostThunk.rejected, (state, action) => {
        state.status = "fail";
        state.isLoading = false;
        const errorPayload = action.payload as responsePost;
        state.error = errorPayload?.msg || "Lỗi chỉnh sửa bài viết không thành công";
        console.log(errorPayload?.msg);
      });
  },
});

export default editPostSlice.reducer;
