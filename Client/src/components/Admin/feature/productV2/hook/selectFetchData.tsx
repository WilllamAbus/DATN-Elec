import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../../redux/store";
import { selectBrandThunk, selectCategoriesThunk, selectConditionShoppingThunk, selectDiscountThunk, selectSupplierThunk } from "../../../../../redux/product/admin/Thunk";

export const useFetchData = () => {
  const dispatch: AppDispatch = useDispatch();
  const brands = useSelector((state: RootState) => state.products.selectBrand.brands);
  const categories = useSelector((state: RootState) => state.products.selectCategories.categories);
  const conditionShopping = useSelector((state: RootState) => state.products.selectConditionShopping.conditionShopping);
  const discounts = useSelector((state: RootState) => state.products.selectDiscount.discounts);
  const suppliers = useSelector((state: RootState) => state.products.selectSupplier.suppliers);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          dispatch(selectBrandThunk()),
          dispatch(selectCategoriesThunk()),
          dispatch(selectConditionShoppingThunk()),
          dispatch(selectDiscountThunk()),
          dispatch(selectSupplierThunk())
        ]);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, [dispatch]);

  return { brands, categories, conditionShopping, discounts, suppliers };
};
