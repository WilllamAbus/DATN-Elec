import instance from "../../axios";  
import { ImageResponse } from "./types/getImageByVariantId"; 

export const getImageByVariantId = async (variantId: string, page: number = 1): Promise<ImageResponse> => {
  try {

    const response = await instance.get<ImageResponse>(`/admin/product/get-image-by-variant/${variantId}`, {
      params: { page },
    });
    return response.data; 
  } catch (error) {
    console.error('Lỗi khi lấy ảnh theo biến thể sản phẩm:', error);
    

    return {
      success: false,
      err: -1,
      msg: 'Lỗi khi lấy ảnh theo biến thể sản phẩm',
      status: 500,
      data: {
        images: [],
        total: 0,
        imageCountOnPage: 0,
      },
      pagination: {  
        currentPage: page,
        totalPages: 0,
        hasNextPage: false, 
        hasPrevPage: false, 
      },
    };
  }
};
