import { useEffect } from "react";
import {
  Card,
  CardHeader,
  Image,

  Tooltip
} from "@nextui-org/react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../../../redux/store";
import { Link, useParams } from "react-router-dom";
import { getAllProductVariantsByVariantPriceThunk } from "../../../../../../redux/product/client/Thunk";
import { ProductVariantData } from "../../../../../../services/detailProduct/types/getAllProductVariantsByVariantPrice";
import { MdPriceChange } from "react-icons/md";
import currencyFormatter from 'currency-formatter';
import ProductsInTheSameSegmentSkeleton from "../../../../skeleton/product/ProductsInTheSameSegmentSkeleton"; 
import {MyButton} from "../../../../../../common/customs/MyButton"; // Import your custom button component

const ProductsInTheSameSegment = () => {
  const { slug } = useParams<{ slug: string }>();
  const dispatch: AppDispatch = useDispatch();

  const productDetail: ProductVariantData[] =
    useSelector(
      (state: RootState) =>
        state.productClient.getAllProductVariantsByVariantPrice.productVariantsList
    ) || [];
  const currentPage = useSelector(
    (state: RootState) => state.productClient.getAllProductVariantsByVariantPrice.pagination?.currentPage || 1
  );
  const totalPages = useSelector(
    (state: RootState) => state.productClient.getAllProductVariantsByVariantPrice.pagination?.totalPages || 1
  );
  const isLoading = useSelector(
    (state: RootState) => state.productClient.getAllProductVariantsByVariantPrice.isLoading
  );

  useEffect(() => {
    if (slug) {
      dispatch(getAllProductVariantsByVariantPriceThunk({ slug, page: 1 }));
    }
  }, [slug, dispatch]);

  const handlePageChange = (page: number) => {
    if (slug) {
      dispatch(getAllProductVariantsByVariantPriceThunk({ slug, page }));
    }
  };

  if (isLoading) {
    return <ProductsInTheSameSegmentSkeleton length={productDetail.length} />;
  }

  const hasPrevPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  return (
    <div className="flex items-center justify-center px-2 sm:px-2 md:px-8 py-4">
      <div className="flex flex-col gap-2 w-full max-w-6xl">
        <div className="mb-4 col-span-full xl:mb-2 flex items-center gap-2">
          <MdPriceChange className="text-2xl text-red-600 dark:text-white" />
          <h3 className="text-xl font-semibold text-gray-600 sm:text-2xl dark:text-white">
            Sản phẩm cùng phân khúc
          </h3>
        </div>
        {productDetail && productDetail.length > 0 ? (
          productDetail.map((product) => (
            <Card key={product._id} className="px-1 sm:px-1 md:px-8 py-1 bg-white border border-gray-100 rounded-lg shadow-sm">
              <CardHeader className="flex items-center gap-3">
                <Image
                  alt={product.variant_name}
                  height={120}
                  width={120}
                  radius="sm"
                  src={product.image?.[0]?.image[0] || "https://via.placeholder.com/150"}
                  className="object-contain"
                />
                <Link to={`/product/${product.slug}`}>
                  <div className="flex flex-col justify-center">
                    <p className="text-sm font-semibold">{product.variant_name}</p>
                    <p className="text-small text-redCustom">
                      Giá: {currencyFormatter.format(product.variant_price, { code: 'VND' })}
                    </p>
                  </div>
                </Link>
              </CardHeader>
            </Card>
          ))
        ) : (
          <p>Không có sản phẩm nào cùng phân khúc</p>
        )}
        {totalPages > 1 && (
          <div className="flex justify-between my-4">
            {hasPrevPage && (
              <Tooltip className="capitalize" color="primary" content="Trở lại" showArrow={true}>
                <MyButton
                  variant="flat"
                  size="sm"
                  onPress={() => handlePageChange(currentPage - 1)}
                  className="text-primary-500 bg-gray-100 hover:bg-gray-200 drop-shadow shadow-black ml-2"
                >
                  <span>Trở lại</span>
                </MyButton>
              </Tooltip>
            )}
            {hasNextPage && (
              <Tooltip className="capitalize" color="primary" content="Xem tiếp" showArrow={true}>
                <MyButton
                  size="sm"
                  variant="flat"
                  onPress={() => handlePageChange(currentPage + 1)}
                  className="text-primary-500 bg-gray-100 hover:bg-gray-200 drop-shadow shadow-black ml-2"
                >
                  <span>Xem tiếp</span>
                </MyButton>
              </Tooltip>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsInTheSameSegment;
