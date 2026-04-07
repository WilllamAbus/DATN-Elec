import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addPostThunk } from "../../../thunk"; 
import { responsePost, initialPostState } from "../../../../../services/post/admin/types/post"; 

const addPostSlice = createSlice({
  name: "post/add",
  initialState: initialPostState, 
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addPostThunk.pending, (state) => {
        state.status = "loading";
        state.isLoading = true; 
      })
      .addCase(addPostThunk.fulfilled, (state, action: PayloadAction<responsePost>) => {
        state.status = "success";
        state.isLoading = false;
        if (action.payload) {
          // Bạn có thể thêm bài viết vào mảng nếu có
          // Ví dụ: state.posts.push(action.payload.newPost); // Giả sử response có newPost
        }
        state.error = null;
        console.log(action.payload.msg);
      })
      .addCase(addPostThunk.rejected, (state, action) => {
        state.status = "fail";
        state.isLoading = false;
        const errorPayload = action.payload as responsePost;
        state.error = errorPayload?.msg || "Lỗi thêm bài viết không thành công";
        console.log(errorPayload?.msg);
      });
  },
});

export default addPostSlice.reducer;
