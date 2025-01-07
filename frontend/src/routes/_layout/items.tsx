import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PaginationFooter } from "@/components/Common/PaginationFooter";
import ActionsMenu from "@/components/Common/ActionsMenu";
import { z } from "zod";
import { ItemsService } from '@/client';
import { useEffect } from 'react';
import AddItem from '@/components/Items/AddItem';
import Navbar from '@/components/Common/Navbar';

const itemsSearchSchema = z.object({
  page: z.number().catch(1),
});

export const Route = createFileRoute("/_layout/items")({
  component: Items,
  validateSearch: (search) => itemsSearchSchema.parse(search),
});

const PER_PAGE = 5;

function getItemsQueryOptions({ page }: { page: number }) {
  return {
    queryFn: () =>
      ItemsService.readMyItems({ skip: (page - 1) * PER_PAGE, limit: PER_PAGE }),
    queryKey: ["items", { page }],
  };
}

function ItemsTable() {
  const queryClient = useQueryClient();
  const { page } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const setPage = (page: number) =>
    navigate({ search: (prev: any) => ({ ...prev, page }) });

  const {
    data: items,
    isLoading,
    isPlaceholderData,
  } = useQuery({
    ...getItemsQueryOptions({ page }),
    placeholderData: (prevData) => prevData,
  });

  const hasNextPage = !isPlaceholderData && items?.data.length === PER_PAGE;
  const hasPreviousPage = page > 1;

  useEffect(() => {
    if (hasNextPage) {
      queryClient.prefetchQuery(getItemsQueryOptions({ page: page + 1 }));
    }
  }, [page, queryClient, hasNextPage]);

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading
            ? new Array(4).fill(null).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>Loading...</TableCell>
                </TableRow>
              ))
            : items?.data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.description || "N/A"}</TableCell>
                  <TableCell>
                    <ActionsMenu type={"Item"} value={item} />
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
      <PaginationFooter
        page={page}
        onChangePage={setPage}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
      />
    </>
  );
}

function Items() {
  return (
    <div className="container mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center md:text-left py-6">
            Items Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Navbar type={"Item"} addModalAs={AddItem} />
          <ItemsTable />
        </CardContent>
      </Card>
    </div>
  );
}
