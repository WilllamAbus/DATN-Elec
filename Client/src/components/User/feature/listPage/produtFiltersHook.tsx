  import { useEffect, useState } from "react";
  import { useLocation, useNavigate } from "react-router-dom";
  import queryString from "query-string";
  import { FilterState,ProductBrand,ProductCondition,QueryParamAuction,RAM,STORAGE } from "../../../../services/clientcate/client/types/getProuctbyCategory";
  import { getBrandNameById, getConditionNameById,getRamNameById,getStorageNameById } from "./Utils"; 
  const useProductFilters = (initialQueryParams: QueryParamAuction, brands: ProductBrand[], conditions: ProductCondition[], rams: RAM[], storages: STORAGE[]) => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = { ...initialQueryParams, ...queryString.parse(location.search) };

    const [filters, setFilters] = useState<FilterState>({
      _sort: queryParams._sort as string || "variant_price:ASC",
      brand: queryParams.brand ? (queryParams.brand as string).split(',').map(_id => ({
        _id,
        name: getBrandNameById(brands, _id)
      })) : [],
      conditionShopping: queryParams.conditionShopping ? (queryParams.conditionShopping as string).split(',').map(_id => ({
        _id,
        nameCondition: getConditionNameById(conditions, _id)
      })) : [],
      ram: queryParams.ram ? (queryParams.ram as string).split(',').map(_id => {
        const ramData = getRamNameById(rams, _id);
        return {
            _id,
            name: ramData,
            status: ramData, 
            sku: ramData,
            pid: ramData,
            createdAt: ramData,
            updatedAt: ramData,
            slug: ramData,
        };
    }) : [],
    
    storage: queryParams.storage ? (queryParams.storage as string).split(',').map(_id => {
      const storageData = getStorageNameById(storages, _id);
      return {
          _id,
          name: storageData,
          status: storageData,
          sku: storageData,
          pid: storageData,
          createdAt: storageData,
          updatedAt: storageData,
          slug: storageData
      };
  }) : [],
  
      
      minPrice: queryParams.minPrice ? parseFloat(queryParams.minPrice as string) : undefined,
      maxPrice: queryParams.maxPrice ? parseFloat(queryParams.maxPrice as string) : undefined,
      minDiscountPercent: queryParams.minDiscountPercent ? parseFloat(queryParams.minDiscountPercent as string) : undefined,
      maxDiscountPercent: queryParams.maxDiscountPercent ? parseFloat(queryParams.maxDiscountPercent as string) : undefined,
      page: Number(queryParams.page) || 1,
    });

    useEffect(() => {
      const newQueryParams: QueryParamAuction = {};
      if (filters._sort) newQueryParams._sort = filters._sort;
      if (filters.brand?.length) {
        newQueryParams.brand = filters.brand.map(brand => brand._id).join(',');
      }
      if (filters.conditionShopping?.length) { 
        newQueryParams.conditionShopping = filters.conditionShopping.map(condition => condition._id).join(',');
      }
      if (filters.ram?.length) {  
        newQueryParams.ram = filters.ram.map(ram => ram._id).join(',');
      }
      
      if (filters.storage?.length) {  
        newQueryParams.storage = filters.storage.map(storage => storage._id).join(',');
      }
      
      if (filters.minPrice !== undefined) newQueryParams.minPrice = String(filters.minPrice);
      if (filters.maxPrice !== undefined) newQueryParams.maxPrice = String(filters.maxPrice);
      if (filters.minDiscountPercent !== undefined) newQueryParams.minDiscountPercent = String(filters.minDiscountPercent);
      if (filters.maxDiscountPercent !== undefined) newQueryParams.maxDiscountPercent = String(filters.maxDiscountPercent);
      if (typeof filters.page === 'number') newQueryParams.page = filters.page;

      navigate({
        pathname: window.location.pathname,
        search: queryString.stringify(newQueryParams),
      });
    }, [navigate, filters]);

    return [filters, setFilters] as const;
  };

  export default useProductFilters;