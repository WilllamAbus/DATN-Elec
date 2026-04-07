// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "../redux/store";
// import { getProductDetailThunk } from "../redux/product/client/Thunk";
// import { STORAGE } from "../services/detailProduct/types/getDetailProduct"; 

// export const useProductDetail = (slug: string, storage: STORAGE) => {
//   const dispatch: AppDispatch = useDispatch();

//   const { productDetail, status, error, isLoading } = useSelector(
//     (state: RootState) => state.productClient.getProductDetail
//   );

//   useEffect(() => {
//     if (slug) {
//       dispatch(getProductDetailThunk({ slug, storage }));
//     }
//   }, [slug, dispatch]);

//   return { productDetail, status, error, isLoading };
// };
