import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getListRamThunk } from "../../../../../redux/attribute/thunk";
import { AppDispatch, RootState } from "../../../../../redux/store";
import SearchFormListRam from "../../../../../components/Admin/searchform/searchFormListRam";
import AddProductButton from "../../../../../components/Admin/buttonAdd";
import DropdownCRUD from "../dropdown/dropdownRam";
import { Chip, Pagination, Tooltip } from "@nextui-org/react";
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
          <Chip color={rams.status === "active" ? "success" : "danger"}>
            {rams.status === "active" ? "Hiển thị" : "Đã ẩn"}
          </Chip>
        );


      case "actions":
        return (
          <DropdownCRUD ramId={rams._id} currentPage={currentPage} searchTerm={searchTerm} />
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
              <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
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
