import instance from "../axios";
import { GetDetailProductResponse } from "./types/getDetailProduct";  

export const getProductDetail = async (slug: string): Promise<GetDetailProductResponse> => {
  try {
    const response = await instance.get<GetDetailProductResponse>(`/client/product-detail/product/${slug}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product detail:', error);
    return {
      success: false,
      err: -1,
      msg: 'Error fetching product detail',
      status: 500,  
      data: {} as GetDetailProductResponse['data'], 
    };
  }
};
