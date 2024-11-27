import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../../redux/store";
import { selectCategoryPostThunk, selectProductsThunk } from "../../../../../redux/post/thunk";

export const useFetchData = () => {
  const dispatch: AppDispatch = useDispatch();
  const categories = useSelector((state: RootState) => state.post.selectCategoryPost.categoryPosts); 

  const products = useSelector((state: RootState) => state.post.selectProduct.products);
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(selectCategoryPostThunk());
      await dispatch(selectProductsThunk());
    };
    fetchData();
  }, [dispatch]);
  return { categories, products };
};
