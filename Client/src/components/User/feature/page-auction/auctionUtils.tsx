
import {  ProductBrand, ProductCondition  } from "../../../../services/product_v2/client/types/listPageAuction";
export const getBrandNameById = (brands: ProductBrand[], id: string): string => {
  const brand = brands.find(brand => brand._id === id);
  return brand ? brand.name : ' không xác định Brand';
};
export const getConditionNameById = (conditions: ProductCondition[], id: string): string => {
  const condition = conditions.find(condition => condition._id === id);
  return condition ? condition.nameCondition : ' không xác định Condition';
};
