import React from "react";
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
  CardBody
} from "@nextui-org/react";
import useSWR from "swr";
import { MyButton } from "src/common/customs/MyButton";

// Fix for rest parameter 'args' implicitly has an 'any[]' type.
const fetcher = (...args: [RequestInfo | URL, RequestInit?]) =>
  fetch(...args).then((res) => res.json());

interface Person {
  name: string;
  height: string;
  mass: string;
  birth_year: string;
}

export default function AuctionList() {
  const [page, setPage] = React.useState(1);
  const { data, isLoading } = useSWR<{ count: number; results: Person[] }>(
    `https://swapi.py4e.com/api/people?page=${page}`,
    fetcher,
    {
      keepPreviousData: true,
    }
  );

  const rowsPerPage = 3;

  const pages = React.useMemo(() => {
    return data?.count ? Math.ceil(data.count / rowsPerPage) : 0;
  }, [data?.count, rowsPerPage]);

  const loadingState = isLoading || data?.results.length === 0 ? "loading" : "idle";

  return (
    <>
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
                Diễn biến cuộc đấu giá
              </h4>
            </div>
          </div>
          <MyButton radius="full" size="xl" variant="transparent">
          </MyButton>
        </CardHeader>
        <CardBody className="px-1 py-1 text-small text-default-400">

          <Table
            aria-label="Example table with client async pagination"
            bottomContent={
              pages > 0 ? (
                <div className="flex w-full justify-center">
                  <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="primary"
                    page={page}
                    total={pages}
                    onChange={(page) => setPage(page)}
                  />
                </div>
              ) : null
            }
          >
            <TableHeader>
              <TableColumn key="name">Name</TableColumn>
              <TableColumn key="height">Height</TableColumn>
              <TableColumn key="mass">Mass</TableColumn>
              <TableColumn key="birth_year">Birth year</TableColumn>
            </TableHeader>
            <TableBody
              items={data?.results ?? []}
              loadingContent={<Spinner />}
              loadingState={loadingState}
            >
              {(item) => (
                <TableRow key={item.name}>
                  {(columnKey) => <TableCell>{(item as any)[columnKey]}</TableCell>}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardBody>
      </Card>


    </>

  );
}
