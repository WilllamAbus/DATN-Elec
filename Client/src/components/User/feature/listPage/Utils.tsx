
import {  ProductBrand, ProductCondition,RAM,STORAGE } from "../../../../services/clientcate/client/types/getProuctbyCategory";
export const getBrandNameById = (brands: ProductBrand[], id: string): string => {
  const brand = brands.find(brand => brand._id === id);
  return brand ? brand.name : ' không xác định Brand';
};
export const getConditionNameById = (conditions: ProductCondition[], id: string): string => {
  const condition = conditions.find(condition => condition._id === id);
  return condition ? condition.nameCondition : ' không xác định Condition';
};
export const getRamNameById = (rams: RAM[], id: string): string => {
  const ram = rams.find(ram => ram._id === id);
  return ram ? ram.name : 'không xác định RAM';
};

export const getStorageNameById = (storages: STORAGE[], id: string): string => {
  const storage = storages.find(storage => storage._id === id);
  return storage ? storage.name : 'không xác định Storage';
};