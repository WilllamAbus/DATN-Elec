import React, { useEffect, useState } from "react";
import { getCommentAdmin } from "../../../../services/commnet/comment.service";
import "react-toastify/dist/ReactToastify.css";
import { useLocation, useNavigate } from "react-router-dom";
import { Pagination } from "@nextui-org/react";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
const ListComment: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const pageFromUrl = queryParams.get("page");
    if (!pageFromUrl) {
      navigate(`?page=1`, { replace: true });
    } else {
      setCurrentPage(parseInt(pageFromUrl, 10));
    }
  }, [location.search, navigate]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    navigate(`?page=${page}`);
  };

  const fetchProducts = async () => {
    try {
      // Truyền currentPage vào hàm getCommentAdmin
      const response = await getCommentAdmin(currentPage, 2);
      if (response && Array.isArray(response.data)) {
        setProducts(response.data);
        setTotalPages(response.totalPages);
      } else {
        console.error("Response is not an array:", response);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  return (
    <>
      <Table aria-label="Example static collection table">
        <TableHeader>
          <TableColumn>STT</TableColumn>
          <TableColumn>Tên sản phẩm</TableColumn>
          <TableColumn>Hình ảnh</TableColumn>
          <TableColumn>Số lượng bình luận</TableColumn>
          <TableColumn>#</TableColumn>
        </TableHeader>
        <TableBody>
          {products
            .filter((product) => product?.comments?.length > 0)
            .map((product, index) => (
              <TableRow
                key={product?._id}
                className="border-b text-center dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>{product?.product_name}</TableCell>
                <TableCell>
                  <img
                    src={product?.image[0]}
                    width={100}
                    height={50}
                    alt={product?.product_name}
                  />
                </TableCell>
                <TableCell>{product?.comments?.length}</TableCell>
                <TableCell>
                  <button
                    className="py-2 px-3 flex items-center text-sm font-medium text-center text-white bg-lime-600 rounded-lg hover:bg-lime-500 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    onClick={() =>
                      navigate(`/admin/listDetailComments/${product?.slug}`)
                    }
                  >
                    Chi tiết
                  </button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <div className="flex justify-center my-4">
        {products.length > 0 && (
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
