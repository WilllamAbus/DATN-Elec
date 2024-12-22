import instance from "../axios";
import { ProductAuctionResponse } from "./types/detailAuction";  

export const getProductDetailAuction = async (
  slug: string,
): Promise<ProductAuctionResponse> => {
  try {
  
    const response = await instance.get<ProductAuctionResponse>(
      `/client/product-detail-auction/product-auction/${slug}`
    );

    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết sản phẩm:', error);
    return {
      success: false,
      err: -1,
      msg: 'Lỗi khi lấy chi tiết sản phẩm',
      status: 500,
      data: {} as ProductAuctionResponse['data'],
    };
  }
};
