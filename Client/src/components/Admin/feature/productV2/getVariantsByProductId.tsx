import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getVariantsByProductIdThunk } from "../../../../redux/product/admin/Thunk";
import { AppDispatch, RootState } from "../../../../redux/store";
import { Variant } from "../../../../services/product_v2/admin/types/getVariantByProductId";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Tooltip, Pagination, Button } from "@nextui-org/react";
import { Link, useParams } from "react-router-dom";
import { DeleteIcon } from "../../../../common/Icons/DeleteIcon";
import { AddNoteIcon } from "../../../../common/Icons/AddNoteIcon";
import { EditIcon } from "../../../../common/Icons/EditIcon";
import { EyeIcon } from "../../../../common/Icons/EyeIcon";
import PlaceholderImage from "../../../../common/images/PlaceholderImage";
import { deleteVariant } from "./handlers/deleteVariant";

const GetVariantsByProductId: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const dispatch: AppDispatch = useDispatch();
  const currentPage = useSelector(
    (state: RootState) => state.products.getVariantsByProductId.variantList?.currentPage || 1
  );
  const totalPages = useSelector(
    (state: RootState) => state.products.getVariantsByProductId.pagination?.totalPages || 1
  );
  const variantList = useSelector((state: RootState) => state.products.getVariantsByProductId.variantList?.variants || []);

  useEffect(() => {
    if (productId) {
      dispatch(getVariantsByProductIdThunk({ productId, page: currentPage }));
    }
  }, [dispatch, currentPage, productId]);

  const handlePageChange = (page: number) => {
    if (productId) {
      dispatch(getVariantsByProductIdThunk({ productId, page }));
    } else {
      console.error("productId is undefined");
    }
  };

  const renderCell = (variant: Variant, columnKey: string) => {
    switch (columnKey) {
      case "image":
        return (
          <div className="flex items-center">
            {variant.image && variant.image[0] && variant.image[0].image && variant.image[0].image[0] ? (
              <img
                src={variant.image[0].image[0]}
                className="w-16 md:w-32 max-w-full max-h-full sm:w-24 sm:min-w-[96px] sm:min-h-[96px] mr-2"
                alt={variant.variant_name}
              />
            ) : (
              <PlaceholderImage className="w-16 md:w-32 max-w-full max-h-full sm:w-24 sm:min-w-[96px] sm:min-h-[96px] mr-2" />
            )}
          </div>
        );
      case "variant_name":
        const variantName = variant.variant_name;
        return (
          <Tooltip content={variantName} delay={0}>
            <span>
              {variantName.length > 20 ? `${variantName.substring(0, 20)}...` : variantName}
            </span>
          </Tooltip>
        );
      case "variant_price":
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(variant.variant_price);
        case "color":
          const tooltipContent = (
            <React.Fragment>
              {variant.color && variant.color.length > 0
                ? variant.color.map((color: { name: string }, index) => (
                    <span key={index} style={{ display: "block" }}>
                      {color.name}
                    </span>
                  ))
                : "No colors available"}
            </React.Fragment>
          );
        
          return (
            <Tooltip
            color="primary"
              content={tooltipContent}
              delay={0}
              closeDelay={0}
              motionProps={{
                variants: {
                  exit: {
                    opacity: 0,
                    transition: {
                      duration: 0.1,
                      ease: "easeIn",
                    },
                  },
                  enter: {
                    opacity: 1,
                    transition: {
                      duration: 0.15,
                      ease: "easeOut",
                    },
                  },
                },
              }}
            >
              <Button color="primary" variant="light">
                {variant.color ? `có ${variant.color.length} màu` : "No colors"}
              </Button>
            </Tooltip>
          );
        
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Thêm ảnh cho biến thể">
            <Link to={`/admin/product/${variant._id}/add-image-variant`} className="text-lg text-default-400 cursor-pointer active:opacity-50">
              <AddNoteIcon />
            </Link>
            </Tooltip>
            <Tooltip content="Xem danh sách ảnh">
            <Link to={`/admin/list-image-and-color/${variant._id}`} className="text-lg text-default-400 cursor-pointer active:opacity-50">
              <EyeIcon />
            </Link>
            </Tooltip>
            <Tooltip content="Cập nhật biến thể">
            <Link to={`/admin/product/${variant._id}`} className="text-lg text-default-400 cursor-pointer active:opacity-50">
              <EditIcon />
            </Link>
            </Tooltip>
            <Tooltip color="danger" content="Delete Variant">
              <span
                className="text-lg text-danger cursor-pointer active:opacity-50"
                onClick={() => deleteVariant(variant._id, productId as string, dispatch, currentPage)}
              >
                <DeleteIcon />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>


      <Table aria-label="Product Variants Table" className="p-4">
        <TableHeader>
          <TableColumn>Hình ảnh</TableColumn>
          <TableColumn>Tên sản phẩm</TableColumn>
          <TableColumn>Giá gốc</TableColumn>
          <TableColumn>Màu sắc</TableColumn>
          <TableColumn>Chức năng</TableColumn>
        </TableHeader>
        <TableBody>
          {variantList.map((variant: Variant) => (
            <TableRow key={variant._id} className="text-center">
              <TableCell>{renderCell(variant, "image")}</TableCell>
              <TableCell>{renderCell(variant, "variant_name")}</TableCell>
              <TableCell>{renderCell(variant, "variant_price")}</TableCell>
              <TableCell>{renderCell(variant, "color")}</TableCell>
              <TableCell>{renderCell(variant, "actions")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

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

export default GetVariantsByProductId;
