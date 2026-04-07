import instance from "../../../../axios";
import { ResponseRam } from "../../../types/ram/listRam";

export const getListRam = async (
   page: number,
   search?: string
): Promise<ResponseRam> => {
   try {
      const queryParams = new URLSearchParams({ page: page.toString() });
      if (search) {
         queryParams.append("search", search);
      }

      const response = await instance.get<ResponseRam>(
         `/admin/attributes/list-ram?${queryParams.toString()}`
      );

      return response.data;
   } catch (error) {
      console.error("Error fetching RAMs:", error);
      throw new Error("Failed to fetch RAMs");
   }
};
