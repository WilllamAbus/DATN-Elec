import instance from "../../axios";
import { LimitPageAuctionProductResponse, ProductCondition, ProductBrand } from "./types/listPageAuction";
export const listPageAuction = async (
  page: number,
  _sort: string,
  brand: ProductBrand[] = [], 
  conditionShopping?: ProductCondition[], 
  minPrice?: number,
  maxPrice?: number,
  minDiscountPercent?: number,
  maxDiscountPercent?: number,
  limit?: number
): Promise<LimitPageAuctionProductResponse> => {
  try {
    const brandParam = brand.length > 0 ? brand.map(b => b._id).join(',') : ''; 
    const conditionParam = conditionShopping ? conditionShopping.map(condition => condition._id).join(',') : ''; 
    
    const queryParams = new URLSearchParams({
      page: page.toString(),
      _sort,
      ...(brandParam ? { brand: brandParam } : {}),
      ...(conditionParam ? { conditionShopping: conditionParam } : {}),
      ...(minPrice != null ? { minPrice: minPrice.toString() } : {}),
      ...(maxPrice != null ? { maxPrice: maxPrice.toString() } : {}),
      ...(minDiscountPercent != null ? { minDiscountPercent: minDiscountPercent.toString() } : {}),
      ...(maxDiscountPercent != null ? { maxDiscountPercent: maxDiscountPercent.toString() } : {}),
      ...(limit != null ? { limit: limit.toString() } : {}), 
    });

    const response = await instance.get<LimitPageAuctionProductResponse>(
      `/client/product/auction-product?${queryParams.toString()}`
    );
    return response.data;
  } catch (error) {
    throw new Error("Lỗi");
  }
};
