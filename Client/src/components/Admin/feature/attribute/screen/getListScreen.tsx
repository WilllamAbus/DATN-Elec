import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getListScreenThunk } from "../../../../../redux/attribute/thunk";
import { AppDispatch, RootState } from "../../../../../redux/store";
import SearchFormListScreen from "../../../../../components/Admin/searchform/searchFormListScreen";
import AddProductButton from "../../../../../components/Admin/buttonAdd";
import DropdownCRUD from "../dropdown/dropdownScreen";
import { Chip, Pagination, Tooltip } from "@nextui-org/react";
import { Screen } from "../../../../../services/attribute/types/screen/listScreen";
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
    (state: RootState) => state.attribute.getListScreen.pagination?.currentPage || 1
  );
  const totalPages = useSelector(
    (state: RootState) => state.attribute.getListScreen.pagination?.totalPages || 1
  );
  const screens = useSelector((state: RootState) => state.attribute.getListScreen.screens || []);

  useEffect(() => {
    dispatch(getListScreenThunk({ page: currentPage, search: searchTerm }));
  }, [dispatch, currentPage, searchTerm]);

  const handlePageChange = (page: number) => {
    dispatch(getListScreenThunk({ page, search: searchTerm }));
  };
  const renderCell = (screens: Screen, columnKey: string) => {
    switch (columnKey) {

      case "name":
        const screenName = screens.name;
        return (
          <Tooltip content={screenName} delay={0}>
            <span>
              {screenName.length > 20 ? `${screenName.substring(0, 20)}...` : screenName}
            </span>
          </Tooltip>
        );

      case "status":
        return (
          <Chip color={screens.status === "active" ? "success" : "danger"}>
            {screens.status === "active" ? "Hiển thị" : "Đã ẩn"}
          </Chip>
        );


      case "actions":
        return (
          <DropdownCRUD screenId={screens._id} currentPage={currentPage} searchTerm={searchTerm} />
        );
      default:
        return null;
    }
  };
  const columns = [
    { uid: "name", name: "tên màn hình" },
    { uid: "status", name: "Trạng thái" },
    { uid: "actions", name: "Chức năng" },
  ];


  return (
    <>
      <div className="flex flex-col md:flex-row items-stretch md:items-center md:space-x-3 space-y-3 md:space-y-0 justify-between mx-4 py-4 border-t dark:border-gray-700">
        <SearchFormListScreen />
        <AddProductButton type="addScreen" />
      </div>
      {screens.length === 0 ? (
        <NoDataMessage
          type="screen"
          message={
            searchTerm
              ? "Không tìm thấy kết quả nào phù hợp với từ khóa tìm kiếm."
              : "Không có thông tin màn hình."
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
          <TableBody items={screens}>
            {(screens) => (
              <TableRow key={screens._id}>
                {(columnKey) => (
                  <TableCell>{renderCell(screens, columnKey as string)}</TableCell>
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
