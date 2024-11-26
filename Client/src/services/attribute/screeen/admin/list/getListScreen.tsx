import instance from "../../../../axios";
import { ResponseScreen } from "../../../types/screen/listScreen"; 

export const getListScreen = async (
   page: number,
   search?: string
): Promise<ResponseScreen> => {
   try {
      const queryParams = new URLSearchParams({ page: page.toString() });
      if (search) {
         queryParams.append("search", search);
      }

      const response = await instance.get<ResponseScreen>(
         `/admin/attributes/list-screen?${queryParams.toString()}`
      );

      return response.data;
   } catch (error) {
      console.error("Error fetching screens:", error);
      throw new Error("Failed to fetch screens");
   }
};
