import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCategoryPostListThunk } from "../../../../../redux/post/thunk";
import { AppDispatch, RootState } from "../../../../../redux/store";
import SearchFomCategoryPostList from "../../../../../components/Admin/searchform/searchFomCategoryPostList";
import AddProductButton from "../../../../../components/Admin/buttonAdd";
import DropdownCRUD from "../dropdown/dropdown";
import { Chip, Pagination, Tooltip } from "@nextui-org/react";
import { Category} from "../../../../../services/post/admin/types/listCategoryPost";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import SearchMessage from "../../productV2/searchMessage";

const GetCategoryPostList: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState(""); 
  const currentPage = useSelector(
    (state: RootState) => state.post.listCategoryPost.pagination?.currentPage || 1
  );
  const totalPages = useSelector(
    (state: RootState) => state.post.listCategoryPost.pagination?.totalPages || 1
  );
  const categories = useSelector((state: RootState) => state.post.listCategoryPost.categories || []);

  useEffect(() => {
    dispatch(getCategoryPostListThunk({ page: currentPage, search: searchTerm }));
  }, [dispatch, currentPage, searchTerm]);

  const handlePageChange = (page: number) => {
    dispatch(getCategoryPostListThunk({ page, search: searchTerm }));
  };
  const renderCell = (categorie:Category, columnKey: string) => {
    switch (columnKey) {
      case "image":
        return (
          <div className="flex items-center">
            <img
              src={categorie.image[0]}
              className="w-16 md:w-32 max-w-full max-h-full sm:w-24 sm:min-w-[96px] sm:min-h-[96px]"
              alt={categorie.name}
            />
          </div>
        );
      case "name":
        const categorieName = categorie.name;
        return (
          <Tooltip content={categorieName} delay={0}>
            <span>
              {categorieName.length > 20 ? `${categorieName.substring(0, 20)}...` : categorieName}
            </span>
          </Tooltip>
        );

        case "status":
        return (
          <Chip color={categorie.status === "active" ? "success" : "danger"}>
            {categorie.status === "active" ? "Hiển thị" : "Đã ẩn"}
          </Chip>
        );
        

      case "actions":
        return (
          <DropdownCRUD categoryId={categorie._id} currentPage={currentPage} searchTerm={searchTerm} />
        );
      default:
         return null;
    }
  };
  const columns = [
    { uid: "image", name: "Hình ảnh" },
    { uid: "name", name: "Tên sản phẩm" },
    { uid: "status", name: "Trạng thái" },
    { uid: "actions", name: "Chức năng" },
  ];
  const handleSearchChange = (term: string) => {
    setSearchTerm(term); 
  };

  return (
    <>
      <div className="flex flex-col md:flex-row items-stretch md:items-center md:space-x-3 space-y-3 md:space-y-0 justify-between mx-4 py-4 border-t dark:border-gray-700">
        <SearchFomCategoryPostList onSearchChange={handleSearchChange} />
        <AddProductButton type="addCategoryPost" />
      </div>
      {categories.length === 0 ? (
       <SearchMessage /> 
      ) : (
        <Table aria-label="Product Variants Table" className="p-4">
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={categories}>
        {(categorie) => (
         <TableRow key={categorie._id}>
         {(columnKey) => (
           <TableCell>{renderCell(categorie, columnKey as string)}</TableCell>
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

export default GetCategoryPostList;
