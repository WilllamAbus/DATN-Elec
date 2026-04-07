import { useState, useEffect } from "react";
import {
  selectBrand,
  selectSupplier,
  selectDiscount,
  selectProductFormat,
  selectConditionShopping,
  selectCategories,
} from "../../../../../services/product_v2/admin/select";
import {
  Brand,
  Supplier,
  Discount,
  ProductFormat,
  ConditionShopping,
  Category,
} from "../../../../../services/product_v2/admin/types";

interface FetchDataResult {
  brands: Brand[];
  suppliers: Supplier[];
  discounts: Discount[];
  productFormats: ProductFormat[];
  conditionShoppingList: ConditionShopping[];
  categories: Category[];
}

export const selectFetchData = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [productFormats, setProductFormats] = useState<ProductFormat[]>([]);
  const [conditionShoppingList, setConditionShoppingList] = useState<ConditionShopping[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const [
          brandsData,
          suppliersData,
          discountsData,
          formatsData,
          conditionsData,
          categoriesData,
        ] = await Promise.all([
          selectBrand(),
          selectSupplier(),
          selectDiscount(),
          selectProductFormat(),
          selectConditionShopping(),
          selectCategories(),
        ]);
        if (isMounted) {
          setBrands(brandsData);
          setSuppliers(suppliersData);
          setDiscounts(discountsData);
          setProductFormats(formatsData);
          setConditionShoppingList(conditionsData);
          setCategories(categoriesData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    brands,
    suppliers,
    discounts,
    productFormats,
    conditionShoppingList,
    categories,
  } as FetchDataResult;
};
