import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getListRamThunk } from "../../../../../redux/attribute/thunk";
import { AppDispatch, RootState } from "../../../../../redux/store";
import SearchFormListRam from "../../../../../components/Admin/searchform/searchFormListRam";
import AddProductButton from "../../../../../components/Admin/buttonAdd";
import { Pagination, Tooltip } from "@nextui-org/react";
import { Ram } from "../../../../../services/attribute/types/ram/listRam";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import NoDataMessage from "../noData/noData";
import { CustomMyButton, MyButton } from "../../../../../common/customs/MyButton";
import { CheckIcon, DeleteIcon, EditDocumentIcon } from "../../../../../common/Icons";
import CustomChip from "../../../../../common/customs/CustomChip";
import { handlesoftDeleteRam } from "../handlers/softDeleteRam";


const getListScreen: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [searchTerm] = useState("");
  const currentPage = useSelector(
    (state: RootState) => state.attribute.getListRam.pagination?.currentPage || 1
  );
  const totalPages = useSelector(
    (state: RootState) => state.attribute.getListRam.pagination?.totalPages || 1
  );
  const rams = useSelector((state: RootState) => state.attribute.getListRam.rams || []);

  useEffect(() => {
    dispatch(getListRamThunk({ page: currentPage, search: searchTerm }));
  }, [dispatch, currentPage, searchTerm]);

  const handlePageChange = (page: number) => {
    dispatch(getListRamThunk({ page, search: searchTerm }));
  };
  const renderCell = (rams: Ram, columnKey: string) => {
    switch (columnKey) {

      case "name":
        const ramName = rams.name;
        return (
          <Tooltip content={ramName} delay={0}>
            <span>
              {ramName.length > 20 ? `${ramName.substring(0, 20)}...` : ramName}
            </span>
          </Tooltip>
        );
        case "status":
          return (
            <CustomChip
              startContent={<CheckIcon size={18} />}
              color={rams.status === "active" ? "springGreen" : "danger"}
              className="drop-shadow shadow-black text-white"
              variant="flat"
            >
              {rams.status === "active" ? "Hiển thị" : "Đã ẩn"}
            </CustomChip>
          );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Xóa">
              <MyButton
                variant="shadow"
                size="sm"
                className="text-[#C20E4D] bg-gray-100 hover:bg-gray-200 drop-shadow shadow-black text-sm cursor-pointer active:opacity-50"
                onClick={() => handlesoftDeleteRam(rams._id, dispatch, currentPage, searchTerm)}
              >
                <DeleteIcon /> Xóa
              </MyButton>
            </Tooltip>
            <Tooltip content="Cập nhật">
              <div>
                <CustomMyButton
                  as={Link}
                  to={`/admin/edit-ram/${rams._id}`}
                  variant="shadow"
                  size="sm"
                  className="text-success bg-gray-100 hover:bg-gray-200 drop-shadow shadow-black text-sm cursor-pointer active:opacity-50"
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
  const columns = [
    { uid: "name", name: "tên ram" },
    { uid: "status", name: "Trạng thái" },
    { uid: "actions", name: "Chức năng" },
  ];


  return (
    <>
      <div className="flex flex-col md:flex-row items-stretch md:items-center md:space-x-3 space-y-3 md:space-y-0 justify-between mx-4 py-4 border-t dark:border-gray-700">
        <SearchFormListRam />
        <AddProductButton type="addRam" />
      </div>
      {rams.length === 0 ? (
        <NoDataMessage
          type="ram"
          message={
            searchTerm
              ? "Không tìm thấy kết quả nào phù hợp với từ khóa tìm kiếm."
              : "Không có thông tin ram."
          }
        />
      ) : (
        <Table aria-label="Product Variants Table" className="p-4">
          <TableHeader columns={columns}>
            {(column) => (
            <TableColumn key={column.uid} style={{ minWidth: "200px" }}>
            {column.name}
          </TableColumn>
            )}
          </TableHeader>
          <TableBody items={rams}>
            {(ram) => (
              <TableRow key={ram._id}>
                {(columnKey) => (
                  <TableCell>{renderCell(ram, columnKey as string)}</TableCell>
                )}
              </TableRow>
            )}
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

export default getListScreen;
