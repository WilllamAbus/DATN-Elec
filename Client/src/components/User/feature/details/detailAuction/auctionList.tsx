import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Spinner,
  Avatar,
  Card,
  CardHeader,
  CardBody,
} from "@nextui-org/react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../../redux/store";
import { getBiddingListThunk } from "../../../../../redux/product/client/Thunk";
import { useParams } from "react-router-dom";

export default function AuctionList() {
  const dispatch: AppDispatch = useDispatch();
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState(1);

  // Redux selectors
  const { productDetails, biddingList, pagination, isLoading } = useSelector(
    (state: RootState) => state.productClient.getBiddingList
  );

  // Fetch data khi component mount hoặc khi slug/page thay đổi
  useEffect(() => {
    if (slug) {
      dispatch(getBiddingListThunk({ slug, page }));
    }
  }, [dispatch, slug, page]);

  return (
    <Card className="max-w-full shadow-none bg-white">
      <CardHeader className="justify-between">
        <div className="flex gap-2 items-center">
          <Avatar
            radius="full"
            size="sm"
            className="border-none"
            src="https://firebasestorage.googleapis.com/v0/b/xprojreact.appspot.com/o/icon%2FOrange%20White%20Modern%20Gradient%20%20IOS%20Icon%20(1).svg?alt=media&token=f7d5bd21-7241-4fcc-9c58-ad67f1a51566"
          />
          <div className="flex flex-col gap-1 items-center justify-center">
            <h4 className="text-small font-bold leading-none text-default-600">
              Diễn biến cuộc đấu giá
            </h4>
            <p className="text-xs text-default-400">
              {productDetails?.productName || "Đang tải..."}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardBody className="px-1 py-1 text-small text-default-400">
        {/* Danh sách đấu giá */}
        {biddingList && biddingList.length > 0 ? (
          <Table
            aria-label="Bidding List Table"
            bottomContent={
              pagination?.totalPages && pagination.totalPages > 1 ? (
                <div className="flex w-full justify-center">
                  <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="primary"
                    page={pagination?.currentPage || 1}
                    total={pagination?.totalPages || 1}
                    onChange={(newPage) => setPage(newPage)}
                  />
                </div>
              ) : null
            }
          >
            <TableHeader>
              <TableColumn key="name">Tên</TableColumn>
              <TableColumn key="bidPrice">Giá đặt</TableColumn>
              <TableColumn key="bidTime">Thời gian đặt giá</TableColumn>
            </TableHeader>
            <TableBody
              items={biddingList ?? []}
              loadingContent={<Spinner />}
              loadingState={isLoading ? "loading" : "idle"}
            >
              {(item) => (
                <TableRow key={item._id}>
                  <TableCell>{item.user.name}</TableCell>
                  <TableCell>{item.bidPrice.toLocaleString()} VND</TableCell>
                  <TableCell>
                    {new Date(item.bidTime).toLocaleString("vi-VN")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        ) : (
          <div className="flex justify-center items-center py-4">
            <p className="text-gray-600 text-lg">
              {isLoading ? "Đang tải..." : "Chưa có đấu giá nào"}
            </p>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
