import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getImageByVariantIdThunk } from "../../../../redux/product/admin/Thunk";
import { AppDispatch, RootState } from "../../../../redux/store";
import { Image } from "../../../../services/product_v2/admin/types/getImageByVariantId";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Tooltip, Pagination, Modal, ModalBody,ModalProps, ModalHeader, Button, useDisclosure, ModalFooter, ModalContent, } from "@nextui-org/react";
import { Link, useParams } from "react-router-dom";

import PlaceholderImage from "../../../../common/images/PlaceholderImage";
import { DeleteIcon, EditIcon } from "../../../../common/Icons";
import { deleteImageVariant } from "./handlers/deleteImageVariant";

const GetImageByVariantIdThunk: React.FC = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [scrollBehavior] = React.useState<ModalProps["scrollBehavior"]>("inside");
  const { variantId } = useParams<{ variantId: string }>();
  const dispatch: AppDispatch = useDispatch();
  const currentPage = useSelector(
    (state: RootState) => state.products.getImageByVariantId.pagination?.currentPage || 1
  );
  const totalPages = useSelector(
    (state: RootState) => state.products.getImageByVariantId.pagination?.totalPages || 1
  );
  const imageList = useSelector((state: RootState) => state.products.getImageByVariantId.imageList?.images || []);

  const [imagesToShow, setImagesToShow] = useState<string[]>([]); 

  useEffect(() => {
    if (variantId) {
      dispatch(getImageByVariantIdThunk({ variantId, page: currentPage }));
    }
  }, [dispatch, currentPage, variantId]);

  const handlePageChange = (page: number) => {
    if (variantId) {
      dispatch(getImageByVariantIdThunk({ variantId, page }));
    } else {
      console.error("productId is undefined");
    }
  };

  const renderCell = (imageList: Image, columnKey: string) => {
    switch (columnKey) {
      case "image":
        const maxImagesToShow = 1;
        const displayedImages = imageList.image.slice(0, maxImagesToShow);
        const remainingImages = imageList.image.slice(maxImagesToShow);

        return (
          <div className="flex items-center space-x-2 flex-wrap">
            {Array.isArray(imageList.image) && imageList.image.length > 0 ? (
              <>
                {displayedImages.map((img: string, index: number) => (
                  <img
                    key={index}
                    src={img}
                    className="w-16 md:w-32 max-w-full max-h-full sm:w-24 sm:min-w-[96px] sm:min-h-[96px] mr-2"
                    alt={imageList.color?.name || `Product image ${index + 1}`}
                  />
                ))}
                {remainingImages.length > 0 && (
                  <Tooltip content={`+${remainingImages.length} ảnh`} delay={0}>
                    <Button
                    variant="ghost"  
                    color="primary"
                      onPress={() => {
                        setImagesToShow(remainingImages);
                        onOpen();
                      }}
                      className="mt-2"
                    >
                      Xem {remainingImages.length} ảnh
                    </Button>
                  </Tooltip>
                )}
              </>
            ) : (
              <PlaceholderImage className="w-16 md:w-24 lg:w-32 max-w-full max-h-full sm:w-24 sm:min-w-[96px] sm:min-h-[96px] mr-2 mb-2" />
            )}
          </div>

        );

      case "color":
        const colorName = imageList.color?.name || "No Color";
        return (
          <Tooltip content={colorName} delay={0}>
            <span>
              {colorName.length > 20 ? `${colorName.substring(0, 20)}...` : colorName}
            </span>
          </Tooltip>
        );

        case "actions":
          return (
            <div className="relative flex items-center gap-2">
              <Tooltip color="danger" content="Xóa ảnh">
                <span
                  className="text-lg text-danger cursor-pointer active:opacity-50"
                  onClick={() =>
                    deleteImageVariant(
                      variantId || "",
                      imageList._id,
                      dispatch,
                      currentPage
                    )
                  }
                >
                  <DeleteIcon />
                </span>
              </Tooltip>
              <Tooltip content="Cập nhật màu sắc">
            <Link to={`/admin/edit-image-and-color/${imageList._id}`} className="text-lg text-default-400 cursor-pointer active:opacity-50">
              <EditIcon />
            </Link>
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
          <TableColumn>Màu sắc</TableColumn>
          <TableColumn>Chức năng</TableColumn>
        </TableHeader>
        <TableBody>
          {(Array.isArray(imageList) ? imageList : []).map((imageList: Image) => (
            <TableRow key={imageList._id} className="text-center">
              <TableCell>{renderCell(imageList, "image")}</TableCell>
              <TableCell>{renderCell(imageList, "color")}</TableCell>
              <TableCell>{renderCell(imageList, "actions")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}  scrollBehavior={scrollBehavior} aria-labelledby="modal-title">
  <ModalContent>
    {(onClose) => (
      <>
        <ModalHeader>
          <p id="modal-title" className="text-lg">Các ảnh còn lại</p>
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-wrap justify-center gap-2">
            {imagesToShow.map((img: string, index: number) => (
              <img
                key={index}
                src={img}
                className="w-full sm:w-24 md:w-32 lg:w-40 xl:w-48 h-auto object-cover rounded-md"
                alt={`Image ${index + 1}`}
              />
            ))}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Đóng
          </Button>
        </ModalFooter>
      </>
    )}
  </ModalContent>
</Modal>



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

export default GetImageByVariantIdThunk;
