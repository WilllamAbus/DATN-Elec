import React, { useEffect, useState } from "react";
import {
  getCommentDelete,
  restoreComment,
  deleteCommentAdmin,
} from "../../../../services/commnet/comment.service";
import { getOneProduct } from "../../../../services/product_v2/admin/getone";
import Swal, { SweetAlertResult } from "sweetalert2";
import { Pagination } from "@nextui-org/react";

import withReactContent from "sweetalert2-react-content";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";

const MySwal = withReactContent(Swal);
interface Comment {
  _id: string;
  id_product: string;
  content: string;
  rating: number;
  image: string[];
}

const ListComment: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [products, setProducts] = useState<{
    [key: string]: { name: string; price: number; image: string[] };
  }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigatee = useNavigate();

  const fetchProduct = async (id_product: string) => {
    try {
      const response = await getOneProduct(id_product);
      if (response && response.product) {
        const { product_name, product_price, image } = response.product;
        setProducts((prev) => ({
          ...prev,
          [id_product]: {
            name: product_name,
            price: product_price,
            image: image || [],
          },
        }));
      } else {
        console.error("No product found for this ID.");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  const fetchData = async (page: number) => {
    try {
      const commentResponse = await getCommentDelete(page, 5);

      // Kiểm tra cấu trúc dữ liệu trả về
      if (!commentResponse || !commentResponse.comments) {
        console.error("No comments data found in the response.");
        setComments([]);
        return;
      }

      const commentsData = Array.isArray(commentResponse.comments)
        ? commentResponse.comments
        : [];
      setComments(commentsData);

      // Cập nhật tổng số trang
      if (commentResponse.totalPages) {
        setTotalPages(commentResponse.totalPages);
      } else {
        console.warn("Total pages not found in the response.");
      }

      // Nếu có dữ liệu bình luận, xử lý lấy sản phẩm liên quan
      if (commentsData.length > 0) {
        const productIds = commentsData.map(
          (comment: Comment) => comment.id_product
        );

        // Gọi đồng thời tất cả các sản phẩm
        await Promise.all(
          productIds.map(async (id: string) => {
            try {
              await fetchProduct(id); // Gọi API lấy sản phẩm
            } catch (err) {
              console.error(`Error fetching product with id: ${id}`, err);
            }
          })
        );
      } else {
        console.warn("No comments found in the response.");
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleDelete = async (id_product: string, id_comment: string) => {
    MySwal.fire({
      title: "Xóa vĩnh viễn",
      text: "Bình luận này sẽ không được khôi phục  ",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Có",
      cancelButtonText: "Hủy",
    }).then(async (result: SweetAlertResult) => {
      if (result.isConfirmed) {
        try {
          // Gọi hàm xóa bình luận
          await deleteCommentAdmin(id_product, id_comment);

          // Cập nhật state của comments để bỏ bình luận đã xóa
          setComments(
            (prevComments) =>
              prevComments.filter((comment) => comment._id !== id_comment) // Giữ lại các bình luận không bị xóa
          );

          MySwal.fire({
            title: "Đã xóa!",
            text: "Bình luận đã được xóa",
            icon: "success",
            confirmButtonText: "OK",
            showConfirmButton: true,
            confirmButtonColor: "#3085d6",
          });
          await fetchData(currentPage);
        } catch (error) {
          console.error("Error deleting comment:", error);
          MySwal.fire({
            title: "Lỗi!",
            text: "Đã xảy ra sự cố khi xóa bình luận.",
            icon: "error",
          });
        }
      }
    });
  };

  const handleRestore = async (id_comment: string) => {
    MySwal.fire({
      title: "Khôi phục bình luận?",
      text: "Bạn có chắc muốn khôi phục bình luận này không!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Có",
      cancelButtonText: "Hủy",
    }).then(async (result: SweetAlertResult) => {
      if (result.isConfirmed) {
        try {
          await restoreComment(id_comment);

          setComments(
            (prevComments) =>
              prevComments.filter((comment) => comment._id !== id_comment) // Giữ lại các bình luận không bị xóa
          );

          MySwal.fire({
            title: "Đã khôi phục!",
            text: "Đã khôi phục bình luận",
            icon: "success",
            confirmButtonText: "OK",
            showConfirmButton: true,
            confirmButtonColor: "#3085d6",
          });
          await fetchData(currentPage);
        } catch (error) {
          console.error("Error restoring comment:", error);
          MySwal.fire({
            title: "Lỗi!",
            text: "Đã xảy ra sự cố khi khôi phục bình luận.",
            icon: "error",
          });
        }
      }
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    navigatee(`?page=${page}`);
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const pageFromUrl = queryParams.get("page");
    if (!pageFromUrl) {
      navigatee(`?page=1`, { replace: true });
    } else {
      setCurrentPage(parseInt(pageFromUrl, 10));
    }
  }, [location.search, navigatee]);
  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);


  return (
    <>
      <Table aria-label="Example static collection table">
        <TableHeader>
          <TableColumn>STT</TableColumn>
          <TableColumn>Tên sản phẩm</TableColumn>
          <TableColumn>Hình ảnh</TableColumn>
          <TableColumn>Nội dung bình luận</TableColumn>
          <TableColumn> Đánh giá</TableColumn>
          <TableColumn>#</TableColumn>
        </TableHeader>
        <TableBody>
          {comments.map((comment, index) => (
            <TableRow
              key={comment?._id}
              className="border-b text-left dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <TableCell className="px-4 py-3">{index + 1}</TableCell>
              <TableCell className="px-4 py-3">
                {products[comment?.id_product]?.name || "Loading..."}
              </TableCell>
              <TableCell className="px-4 py-3">
                {/* Hiển thị hình ảnh nếu cần thiết */}
                <img
                  src={products[comment?.id_product]?.image[0]} // sử dụng phần tử đầu tiên của mảng hình ảnh
                  width={100}
                  height={50}
                />
              </TableCell>
              <TableCell className="px-4 py-3">{comment?.content}</TableCell>
              <TableCell className="px-4 py-3 text-sm text-yellow-400">
                {Array.from({ length: comment?.rating }, (_, i) => (
                  <span key={i}>
                    <i className="fa-solid fa-star"></i>
                  </span>
                ))}
              </TableCell>
              <TableCell className="px-4 py-3 ">
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    className="flex items-center text-red-700 bg-red-200 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-2 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                    onClick={() =>
                      handleDelete(comment?.id_product, comment?._id)
                    }
                  >
                    Xoá
                  </button>
                  <button
                    className="py-2 px-3 flex items-center text-sm font-medium text-center text-white bg-lime-600 rounded-lg hover:bg-lime-500 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    onClick={() => handleRestore(comment?._id)}
                  >
                    Khôi phục
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-center my-4">
      {comments.length > 0 && (
          <Pagination
          isCompact
          loop
          showControls
          color="primary"
          total={totalPages}
          page={currentPage}
          initialPage={1}
          onChange={(page) => handlePageChange(page)}
        />
      )}
      </div>

      

    </>
  );
};

export default ListComment;
