import instance from "../../axios";
import { VariantsResponse } from "./types/getVariantByProductId"; 

export const getVariantsByProductId = async (productId: string, page: number = 1): Promise<VariantsResponse> => {
  try {
    const response = await instance.get<VariantsResponse>(`/admin/product/get-variant-by-product/${productId}`, {
      params: { page },
    });

    
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy thông tin biến thể của sản phẩm:', error);
    return {
      success: false,
      err: -1,
      msg: 'Lỗi khi lấy thông tin biến thể của sản phẩm',
      status: 500,
      data: {
        total: 0,
        productCountOnPage: 0,
        variants: [],
        currentPage: page,
        limit: 0,
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
