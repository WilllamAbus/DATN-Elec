  // import { createSlice, PayloadAction } from '@reduxjs/toolkit';
  // import { FilterState, ProductCondition, ProductBrand } from '../../../../services/product_v2/client/types/listPageAuction';

  // const initialState: FilterState = {
  //   _sort: '',
  //   brand: [],
  //   conditionShopping: [],
  //   minPrice: undefined,
  //   maxPrice: undefined,
  //   minDiscountPercent: undefined,
  //   maxDiscountPercent: undefined,
  //   limit: 10,
  // };

  // const filterSlice = createSlice({
  //   name: 'filter',
  //   initialState,
  //   reducers: {
  //     setNewFilter(state, action: PayloadAction<Partial<FilterState>>) {
  //       return { ...state, ...action.payload };
  //     },
      
  //     setFilters(state, action: PayloadAction<Partial<FilterState>>) {
  //       return { ...state, ...action.payload };
  //     },
  //     setSort(state, action: PayloadAction<string>) {
  //       state.sort = action.payload;
  //     },
  //     setBrand(state, action: PayloadAction<ProductBrand[]>) {
  //       state.brand = action.payload;
  //     },
  //     setConditionShopping(state, action: PayloadAction<ProductCondition[]>) {
  //       state.conditionShopping = action.payload;
  //     },
  //     setPrice(state, action: PayloadAction<{ minPrice?: number; maxPrice?: number }>) {
  //       const { minPrice, maxPrice } = action.payload;
  //       if (minPrice !== undefined) state.minPrice = minPrice;
  //       if (maxPrice !== undefined) state.maxPrice = maxPrice;
  //     },
  //     setDiscount(state, action: PayloadAction<{ minDiscountPercent?: number; maxDiscountPercent?: number }>) {
  //       const { minDiscountPercent, maxDiscountPercent } = action.payload;
  //       if (minDiscountPercent !== undefined) state.minDiscountPercent = minDiscountPercent;
  //       if (maxDiscountPercent !== undefined) state.maxDiscountPercent = maxDiscountPercent;
  //     },
  //     setLimit(state, action: PayloadAction<number>) {
  //       state.limit = action.payload;
  //     },
  //     clearFilters() {
  //       return initialState;
  //     },
  //   },
  // });

  // export const { setSort,setBrand, setConditionShopping, setPrice, setDiscount, setLimit, clearFilters,setFilters,setNewFilter} = filterSlice.actions;
  // export default filterSlice.reducer;
