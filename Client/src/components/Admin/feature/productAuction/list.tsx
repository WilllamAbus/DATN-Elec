import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listProductAuctionThunk } from "../../../../redux/product/admin/Thunk";
import { Link } from "react-router-dom";
import { AppDispatch, RootState } from "../../../../redux/store";
import { handleSoftDeleteProduct } from "../productAuction/handlers/softDelete";
import SearchFomAuctionProduct from "../../../../components/Admin/searchform/searchFomAuctionProduct";
import AddProductButton from "../../../../components/Admin/buttonAdd";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Tooltip, Pagination } from "@nextui-org/react";
import { CheckIcon, DeleteIcon, EditDocumentIcon } from "../../../../common/Icons";
import SearchMessage from "../productV2/searchMessage";
import NoProductsMessage from "../productV2/noProduct";
import { MyButton, CustomMyButton } from "../../../../common/customs/MyButton";
import CustomChip from "../../../../common/customs/CustomChip";


const ProductListAuction: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [searchTerm,] = useState("");
  const currentPage = useSelector(
    (state: RootState) => state.products.LimitProductAuction.pagination?.currentPage || 1
  );
  const totalPages = useSelector(
    (state: RootState) => state.products.LimitProductAuction.pagination?.totalPages || 1
  );
  const products = useSelector((state: RootState) => state.products.LimitProductAuction.products || []);

  useEffect(() => {
    dispatch(listProductAuctionThunk({ page: currentPage, search: searchTerm }));
  }, [dispatch, currentPage, searchTerm]);

  const handlePageChange = (page: number) => {
    dispatch(listProductAuctionThunk({ page, search: searchTerm }));
  };

  const renderCell = (product: any, columnKey: string) => {
    switch (columnKey) {
      case "image":
        return (
          <div className="flex items-center">
            <img
              src={product.image[0]}
              alt={product.product_name}
              className="w-16 md:w-32 max-w-full max-h-full sm:w-24 sm:min-w-[96px] sm:min-h-[96px] mr-2 rounded-xl"
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
      case "product_type":
        return (
          <Chip color="primary">
            {product.product_type?.name || "Chưa có loại"}
          </Chip>
        );
      case "product_price":
        return new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(product.product_price);
      case "status":
        return (
          <CustomChip color={product.status === "active" ? "springGreen" : "danger"}    startContent={<CheckIcon size={18} /> }>
            {product.status === "active" ? "Hiển thị" : "Đã ẩn"}
          </CustomChip>
        );
      case "actions":
        return (
          <div className="flex items-center space-x-2">
            <Tooltip content="Xóa mềm">
              <MyButton
                variant="shadow"
                size="sm"
                className="text-[#C20E4D] bg-gray-100 hover:bg-gray-200 drop-shadow shadow-black"
                onClick={() => handleSoftDeleteProduct(product._id, dispatch, currentPage, searchTerm)}
              >
                <DeleteIcon /> Xóa
              </MyButton>
            </Tooltip>

            <Tooltip content="Cập nhật">
              <div>
                <CustomMyButton
                  as={Link} // Link component từ react-router-dom
                  to={`/admin/edit-product-auction/${product._id}`} // Đường dẫn
                  variant="shadow"
                  size="sm"
                  className="text-success bg-gray-100 hover:bg-gray-200 drop-shadow shadow-black"
                >
                  <EditDocumentIcon /> Cập nhật
                </CustomMyButton>
              </div>
            </Tooltip>

          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row items-stretch md:items-center md:space-x-3 space-y-3 md:space-y-0 justify-between mx-4 py-4 border-t dark:border-gray-700">
        <SearchFomAuctionProduct />
        <AddProductButton type="addProductAuction" />
      </div>

      {products.length === 0 ? (
        searchTerm.length > 0 ? <SearchMessage /> : <NoProductsMessage />
      ) : (
        <Table
          aria-label="Product List Auction Table"
          shadow={undefined}
          color="secondary"
          className="p-4"
        >
          <TableHeader>
            <TableColumn>Hình ảnh</TableColumn>
            <TableColumn>Tên sản phẩm</TableColumn>
            <TableColumn>Danh mục</TableColumn>
            <TableColumn>Giá gốc</TableColumn>
            <TableColumn>Trạng thái</TableColumn>
            <TableColumn>Chức năng</TableColumn>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id}>
                {["image", "product_name", "product_type", "product_price", "status", "actions"].map((columnKey) => (
                  <TableCell key={columnKey}>{renderCell(product, columnKey)}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      {totalPages > 1 && (
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
      )}

    </>
  );
};

export default ProductListAuction;
