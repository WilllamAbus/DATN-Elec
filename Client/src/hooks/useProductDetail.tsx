import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/store"; 
import { getProductDetailThunk } from "../redux/product/client/Thunk";

export const useProductDetail = (slug: string) => {
  const dispatch = useAppDispatch();

  const { productDetail, status, error, isLoading } = useAppSelector(
    (state) => state.productClient.getProductDetail
  );
  useEffect(() => {
    if (slug) {
      dispatch(getProductDetailThunk(slug)); 
    }
  }, [slug, dispatch]);

  return { productDetail, status, error, isLoading };
};
