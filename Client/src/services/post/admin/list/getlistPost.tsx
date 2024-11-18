import instance from "../../../axios";
import { ResponsePost } from "../types/listPost";
export const getListPost = async (
   page: number,
   search?: string
): Promise<ResponsePost> => {
   try {
      const queryParams = new URLSearchParams({ page: page.toString() });
      if (search) {
         queryParams.append("search", search);
      }


      const response = await instance.get<ResponsePost>(
         `/admin/post/list-post?${queryParams.toString()}`
      );

      return response.data;
   } catch (error) {
      console.error("Error fetching posts:", error);
      throw new Error("Failed to fetch posts");
   }
};
