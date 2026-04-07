import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDeleteListAuctionThunk } from "../../../../redux/product/admin/Thunk";
import { AppDispatch, RootState } from "../../../../redux/store";
import { handleDeleteAuction } from "../productAuction/handlers/hardDeleteAuction";
import SearchFomDeleteListAuction from "../../../../components/Admin/searchform/searchFomDeleteListAuction";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Tooltip, Pagination, Avatar } from "@nextui-org/react";
import { CheckIcon, DeleteIcon, RestoreIcon } from "../../../../common/Icons";
import SearchMessage from "../productV2/searchMessage";
import NoProductsMessage from "../productV2/noProduct";
import { restoreAuction } from "./handlers/restoreAuction";
import { MyButton, CustomMyButton } from "../../../../common/customs/MyButton";
const ProductListAuction: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [searchTerm] = useState("");
  const currentPage = useSelector(
    (state: RootState) => state.products.getDeleteListAuction.pagination?.currentPage || 1
  );
  const totalPages = useSelector(
    (state: RootState) => state.products.getDeleteListAuction.pagination?.totalPages || 1
  );
  const productAuctions = useSelector((state: RootState) => state.products.getDeleteListAuction.productAuction || []);

  useEffect(() => {
    dispatch(getDeleteListAuctionThunk({ page: currentPage, search: searchTerm }));
  }, [dispatch, currentPage, searchTerm]);

  const handlePageChange = (page: number) => {
    dispatch(getDeleteListAuctionThunk({ page, search: searchTerm }));
  };

  const renderCell = (productAuction: any, columnKey: string) => {
    switch (columnKey) {
      case "image":
        return (
          <div className="flex items-center">
            <img
              src={productAuction.image[0]}
              alt={productAuction.product_name}
              className="w-16 md:w-32 max-w-full max-h-full sm:w-24 sm:min-w-[96px] sm:min-h-[96px] mr-2 rounded-xl"
            />
          </div>
        );
      case "product_name":
        const productName = productAuction.product_name;
        return (
          <Tooltip content={productName} delay={0}>
            <span>
              {productName.length > 20 ? `${productName.substring(0, 20)}...` : productName}
            </span>
          </Tooltip>
        );
      case "product_type":
        return (
          <Chip
            color="primary"
            avatar={
              <Avatar
                name={productAuction.product_type?.name || "N/A"}
                size="sm"
                getInitials={(name) => name ? name.charAt(0) : "N"}
              />
            }
          >
            {productAuction.product_type?.name || "Chưa có loại"}
          </Chip>
        );

      case "product_price":
        return new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(productAuction.product_price);
      case "status":
        return (
          <Chip color={productAuction.status === "active" ? "success" : "danger"} startContent={<CheckIcon size={18} />}>
            {productAuction.status === "active" ? "Hiển thị" : "Đã ẩn"}
          </Chip>
        );
      case "actions":
        return (
          <div className="flex items-center space-x-2">
            <Tooltip content="Xóa">
              <MyButton
                variant="shadow"
                size="sm"
                className="text-[#C20E4D] bg-gray-100 hover:bg-gray-200 drop-shadow shadow-black"
                onClick={() =>
                  handleDeleteAuction(productAuction._id, dispatch, currentPage, searchTerm)
                }
              >
                <DeleteIcon /> Xóa
              </MyButton>
            </Tooltip>
            <Tooltip content="Khôi phục">
            <div>
              <CustomMyButton
                variant="shadow"
                size="sm"
                onClick={() =>
                  restoreAuction(productAuction._id, dispatch, currentPage, searchTerm)
                }
                className="text-success bg-gray-100 hover:bg-gray-200 drop-shadow shadow-black"
              >
                <RestoreIcon /> Khôi phục
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
        <SearchFomDeleteListAuction />
      </div>

      {productAuctions.length === 0 && searchTerm ? (
        <SearchMessage />
      ) : productAuctions.length === 0 ? (
        <NoProductsMessage />
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
            {productAuctions.map((productAuction) => (
              <TableRow key={productAuction._id}>
                {["image", "product_name", "product_type", "product_price", "status", "actions"].map((columnKey) => (
                  <TableCell key={columnKey}>{renderCell(productAuction, columnKey)}</TableCell>
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
