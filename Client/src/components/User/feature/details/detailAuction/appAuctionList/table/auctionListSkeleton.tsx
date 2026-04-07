import { Skeleton, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";

interface AuctionListSkeletonProps {
  total: number;
}
export default function AuctionListSkeleton({ total }: AuctionListSkeletonProps) {
  return (
    <Table aria-label="Loading Bidding List Table">
      <TableHeader>
        <TableColumn key="name">Tên</TableColumn>
        <TableColumn key="bidPrice">Giá đặt</TableColumn>
        <TableColumn key="bidTime">Thời gian đặt giá</TableColumn>
      </TableHeader>
      <TableBody>
        {Array.from({ length: total }).map((_, index) => (
          <TableRow key={index}>
            <TableCell><Skeleton style={{ width: '100px', height: '10px' }} className="rounded-md" /></TableCell>
            <TableCell><Skeleton style={{ width: '70px', height: '10px' }} className="rounded-md" /></TableCell>
            <TableCell><Skeleton style={{ width: '150px', height: '10px' }} className="rounded-md" /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
