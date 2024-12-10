import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPaginatedProducts } from "../../../../redux/product/admin/Thunk";
import { AppDispatch, RootState } from "../../../../redux/store";
import SearchFormProduct from "../../../../components/Admin/searchform/searchFomProduct";
import AddProductButton from "../../../../components/Admin/buttonAdd";
import DropdownCRUD from "./dropdown";
import { Avatar, Chip, Pagination, Tooltip } from "@nextui-org/react";
import { IconMdiStickerAlert,CheckIcon,IconMdiBellAlertOutline} from "../../../../common/Icons";
import DropdownVariant from "./dropdownVariant";
import { Product,} from "../../../../services/product_v2/admin/types/pagination";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import CustomChip from "../../../../common/customs/CustomChip";


const ProductList: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [searchTerm] = useState("");
  const currentPage = useSelector(
    (state: RootState) => state.products.pagilistActive.pagination?.currentPage || 1
  );
  const totalPages = useSelector(
    (state: RootState) => state.products.pagilistActive.pagination?.totalPages || 1
  );
  const products = useSelector((state: RootState) => state.products.pagilistActive.products || []);

  useEffect(() => {
    dispatch(fetchPaginatedProducts({ page: currentPage, search: searchTerm }));
  }, [dispatch, currentPage, searchTerm]);

  const handlePageChange = (page: number) => {
    dispatch(fetchPaginatedProducts({ page, search: searchTerm }));
  };
  const renderCell = (product:Product, columnKey: string) => {
    switch (columnKey) {
      case "image":
        return (
          <div className="flex items-center">
            <img
              src={product.image[0]}
              className="w-16 md:w-32 max-w-full max-h-full sm:w-24 sm:min-w-[96px] sm:min-h-[96px]"
              alt={product.product_name}
            />
          </div>
        );
      case "product_name":
        const productName = product.product_name;
        return (
          <Tooltip content={productName} delay={0}>
            <span>
              {productName.length > 20 ? `${productName.substring(0, 20)}...` : productName}
            </span>
          </Tooltip>
        );
      case "category":
        return (
          <Chip
          variant="bordered"
          color="primary"
          classNames={{
            base: "bg-primary-500 from-indigo-500 to-pink-500 border-small border-white/50 shadow-pink-500/30",
            content: "drop-shadow shadow-black text-white",
          }}
          avatar={
            <Avatar

              name={product.product_type?.name || "N/A"}
              size="sm"
              getInitials={(name) => name.charAt(0)}
            />
          }
        >
          {product.product_type?.name}
        </Chip>

        );
        case "status":
          return (
            <CustomChip
            startContent={
              // Hiển thị biểu tượng thích hợp dựa trên trạng thái của sản phẩm
              product.hasVariants === false && (!product.variants || product.variants.length === 0) ? (
                <IconMdiStickerAlert size={18} /> // Không có thuộc tính sản phẩm
              ) : product.hasVariants === true && product.variants.length === 0 ? (
                <IconMdiBellAlertOutline size={18} /> // Không có biến thể nhưng có thuộc tính sản phẩm
              ) : (
                <CheckIcon size={18} /> // Biểu tượng kiểm tra nếu có biến thể
              )
            }
            variant="solid"
            color={
              // Chọn màu cảnh báo khi không có thuộc tính sản phẩm hoặc không có biến thể
              product.hasVariants === false && (!product.variants || product.variants.length === 0)
                ? "orange" // Không có thuộc tính sản phẩm
                : product.hasVariants === true && product.variants.length === 0
                ? "orange" // Không có biến thể
                : "springGreen" // Hiển thị nếu có biến thể và có trạng thái active
            }
            classNames={{
              content: "drop-shadow shadow-black text-white",
            }}
          >
            {
              product.hasVariants === false && (!product.variants || product.variants.length === 0)
                ? "Chưa có thuộc tính sản phẩm" // Không có thuộc tính sản phẩm
                : product.hasVariants === true && product.variants.length === 0
                ? "Chưa có biến thể" // Không có biến thể
                : product.status === "active"
                ? "Hiển thị" // Hiển thị nếu trạng thái là active
                : "Chưa có biến thể" // Nếu có biến thể nhưng không có trạng thái active
            }
          </CustomChip>
          
          );
        
        
      case "variant":
        return <DropdownVariant variants={product.variants} productId={product._id} />;
      case "actions":
        return (
          <DropdownCRUD productId={product._id} currentPage={currentPage} searchTerm={searchTerm} hasVariants={product.hasVariants}variants={product.variants} />
        );
      default:
         return null;
    }
  };
  const columns = [
    { uid: "image", name: "Hình ảnh" },
    { uid: "product_name", name: "Tên sản phẩm" },
    { uid: "category", name: "Danh mục" },
    { uid: "status", name: "Trạng thái" },
    { uid: "variant", name: "Biến thể" },
    { uid: "actions", name: "Chức năng" },
  ];
  return (
    <>
      <div className="flex flex-col md:flex-row items-stretch md:items-center md:space-x-3 space-y-3 md:space-y-0 justify-between mx-4 py-4 border-t dark:border-gray-700">
        <SearchFormProduct />
        <AddProductButton type="addProduct" />
      </div>
      {products.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500 text-center">
            Không có sản phẩm nào khớp với tìm kiếm của bạn.
          </p>
        </div>
      ) : (
        <Table aria-label="Product Variants Table" className="p-4">
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={products}>
        {(product) => (
         <TableRow key={product._id}>
         {(columnKey) => (
           <TableCell>{renderCell(product, columnKey as string)}</TableCell>
         )}
       </TableRow>
        )}
      </TableBody>
    </Table>
      )}
     <div className="flex justify-center my-4">
        <Pagination

          isCompact
          loop
          showControls
          color="primary"
          total={totalPages}
          initialPage={currentPage}
          onChange={(page) => handlePageChange(page)}
        />
      </div>
    </>
  );
};

export default ProductList;
