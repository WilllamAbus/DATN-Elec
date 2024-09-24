import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";
import { FilterState,ProductBrand,ProductCondition,QueryParamAuction } from "../../../../services/product_v2/client/types/listPageAuction";
import { getBrandNameById, getConditionNameById } from "./auctionUtils"; 

const useAuctionFilters = (initialQueryParams: QueryParamAuction, brands: ProductBrand[], conditions: ProductCondition[]) => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = { ...initialQueryParams, ...queryString.parse(location.search) };

  const [filters, setFilters] = useState<FilterState>({
    _sort: queryParams._sort as string || "product_price:ASC",
    brand: queryParams.brand ? (queryParams.brand as string).split(',').map(_id => ({
      _id,
      name: getBrandNameById(brands, _id)
    })) : [],
    conditionShopping: queryParams.conditionShopping ? (queryParams.conditionShopping as string).split(',').map(_id => ({
      _id,
      nameCondition: getConditionNameById(conditions, _id)
    })) : [],
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

export default useAuctionFilters;