import instance from "../../axios";
import { GetOneImageVariantResponse } from "./types/getOneImageVariant"; 

export const getOneImageVariant = async (imageId: string): Promise<GetOneImageVariantResponse> => {
  try {
    const response = await instance.get<GetOneImageVariantResponse>(`/admin/product/get-one-image-variant/${imageId}`);
    console.log('Kết quả', response);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      msg: "Lỗi",
      imageVariant: undefined, 
    };
  }
};
