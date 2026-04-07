import React from "react";
import { hardDeleteProduct, restoreProduct } from "../handlers";
import { AppDispatch } from "../../../../../redux/store";
import { Product } from "../types/main_product";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Tooltip,
  Avatar,
} from "@nextui-org/react";
import { CustomMyButton, MyButton } from "../../../../../common/customs/MyButton";
import { DeleteIcon, RestoreIcon } from "../../../../../common/Icons";

interface ProductTableProps {
  products: Product[];
  dispatch: AppDispatch;
  currentPage: number;
  searchTerm: string;
}

const ProductTable: React.FC<ProductTableProps> = ({ products, dispatch, currentPage, searchTerm }) => {
  const renderCell = (product: Product, columnKey: string) => {
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
          <Chip
            color="primary"
            avatar={
              <Avatar
                name={product.product_type?.name || "N/A"}
                size="sm"
                getInitials={(name) => (name ? name.charAt(0) : "N")}
              />
            }
          >
            {product.product_type?.name || "Chưa có loại"}
          </Chip>
        );
      case "status":
        return (
          <Chip
            color={product.status === "active" ? "success" : "danger"}
            className="capitalize"
          >
            {product.status === "active" ? "Hiển thị" : "Đã ẩn"}
          </Chip>
        );
      case "actions":
        return (
          <div className="flex items-center space-x-4">
            <Tooltip content="Xóa">
              <MyButton
                variant="shadow"
                size="sm"
                className="text-[#C20E4D] bg-gray-100 hover:bg-gray-200 drop-shadow shadow-black"
                onClick={() => hardDeleteProduct(product._id, dispatch, currentPage, searchTerm)}
              >
                <DeleteIcon /> Xóa
              </MyButton>
            </Tooltip>
            <Tooltip content="Khôi phục">
              <div>
                <CustomMyButton
                  variant="shadow"
                  size="sm"
                  onClick={() => restoreProduct(product._id, dispatch, currentPage, searchTerm)}
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
    <Table aria-label="Product List" className="p-4">
      <TableHeader>
        <TableColumn>Hình ảnh</TableColumn>
        <TableColumn>Tên sản phẩm</TableColumn>
        <TableColumn>Danh mục</TableColumn>
        <TableColumn>Trạng thái</TableColumn>
        <TableColumn>Chức năng</TableColumn>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product._id}>
            {["image", "product_name", "product_type", "status", "actions"].map(
              (columnKey) => (
                <TableCell key={columnKey}>{renderCell(product, columnKey)}</TableCell>
              )
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ProductTable;
