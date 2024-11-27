import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getListPostThunk } from "../../../../../redux/post/thunk";
import { AppDispatch, RootState } from "../../../../../redux/store";
import SearchPostList from "../../../../../components/Admin/searchform/searchFomPostList";
import AddProductButton from "../../../../../components/Admin/buttonAdd";
import DropdownCRUD from "../dropdown/dropdownPost";
import { Chip, Pagination, Tooltip } from "@nextui-org/react";
import { Post} from "../../../../../services/post/admin/types/listPost";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import SearchMessage from "../../productV2/searchMessage";
import NoProductsMessage from "../../productV2/noProduct";

const GetCategoryPostList: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [searchTerm] = useState(""); 
  const currentPage = useSelector(
    (state: RootState) => state.post.listPost.pagination?.currentPage || 1
  );
  const totalPages = useSelector(
    (state: RootState) => state.post.listPost.pagination?.totalPages || 1
  );
  const post = useSelector((state: RootState) => state.post.listPost.posts || []);

  useEffect(() => {
    dispatch(getListPostThunk({ page: currentPage, search: searchTerm }));
  }, [dispatch, currentPage, searchTerm]);

  const handlePageChange = (page: number) => {
    dispatch(getListPostThunk({ page, search: searchTerm }));
  };
  const renderCell = (post:Post, columnKey: string) => {
    switch (columnKey) {
      case "image":
        return (
          <div className="flex items-center ">
            <img
              src={post.thumbnail[0]}
              className="rounded-lg w-16 md:w-32 max-w-full max-h-full sm:w-24 sm:min-w-[96px] sm:min-h-[96px]"
              alt={post.title}
            />
          </div>
        );
      case "title":
        const postTitle = post.title;
        return (
          <Tooltip content={postTitle} delay={0}>
            <span>
              {postTitle.length > 20 ? `${postTitle.substring(0, 20)}...` : postTitle}
            </span>
          </Tooltip>
        );

        case "status":
        return (
          <Chip color={post.status === "active" ? "success" : "danger"}>
            {post.status === "active" ? "Hiển thị" : "Đã ẩn"}
          </Chip>
        );
        

      case "actions":
        return (
          <DropdownCRUD postId={post._id} currentPage={currentPage} searchTerm={searchTerm} />
        );
      default:
         return null;
    }
  };
  const columns = [
    { uid: "image", name: "Hình ảnh" },
    { uid: "title", name: "Tiêu đề bài viết" },
    { uid: "status", name: "Trạng thái" },
    { uid: "actions", name: "Chức năng" },
  ];
  
  return (
    <>
      <div className="flex flex-col md:flex-row items-stretch md:items-center md:space-x-3 space-y-3 md:space-y-0 justify-between mx-4 py-4 border-t dark:border-gray-700">
        <SearchPostList/>
        <AddProductButton type="addPost" />
      </div>
      {post.length === 0 && searchTerm ? (
        <SearchMessage /> 
      ) : post.length === 0 ? (
        <NoProductsMessage /> 
      ) : (
        <Table aria-label="Product Variants Table" className="p-4">
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={post}>
        {(post) => (
         <TableRow key={post._id}>
         {(columnKey) => (
           <TableCell>{renderCell(post, columnKey as string)}</TableCell>
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
