import instance from "../../../axios";
import { GetProductsByCategoryResponse, ProductCondition, ProductBrand, RAM, STORAGE } from "../types/getProuctbyCategory";
export const getProductsByCategory = async (
  slug: string,
  page: number,
  _sort?: string,
  brand: ProductBrand[] = [],
  conditionShopping?: ProductCondition[],
  ram: RAM[] = [],
  storage: STORAGE[] = [],
  minPrice?: number,
  maxPrice?: number,
  minDiscountPercent?: number,
  maxDiscountPercent?: number,
  limit?: number
): Promise<GetProductsByCategoryResponse> => {
  try {
    const brandParam = brand.length > 0 ? brand.map(b => b._id).join(',') : '';
    const conditionParam = conditionShopping ? conditionShopping.map(condition => condition._id).join(',') : '';
    const ramParam = ram.length > 0 ? ram.map(r => r._id).join(',') : '';
    const storageParam = storage.length > 0 ? storage.map(s => s._id).join(',') : '';
    const queryParams = new URLSearchParams({
      page: page.toString(),
      _sort: _sort || '',
      ...(brandParam ? { brand: brandParam } : {}),
      ...(conditionParam ? { conditionShopping: conditionParam } : {}),
      ...(ramParam ? { ram: ramParam } : {}),
      ...(storageParam ? { storage: storageParam } : {}),
      ...(minPrice != null ? { minPrice: minPrice.toString() } : {}),
      ...(maxPrice != null ? { maxPrice: maxPrice.toString() } : {}),
      ...(minDiscountPercent != null ? { minDiscountPercent: minDiscountPercent.toString() } : {}),
      ...(maxDiscountPercent != null ? { maxDiscountPercent: maxDiscountPercent.toString() } : {}),
      ...(limit != null ? { limit: limit.toString() } : {}),
    });
    const response = await instance.get<GetProductsByCategoryResponse>(
      `client/product/category/${slug}?${queryParams.toString()}`
    );

    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.msg);
    }
  } catch (error) {
    console.error("Lỗi:", error);
    throw error;
  }
};
