import { ProfileService } from "@/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Route } from "@/routes/_layout/admin";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Skeleton } from "../ui/skeleton";
import { PaginationFooter } from "../Common/PaginationFooter";
import ActionsMenu from "../Common/ActionsMenu";

const PER_PAGE = 5;

function getRolesQueryOptions({ page }: { page: number }) {
  return {
    queryFn: () =>
      ProfileService.readRoles({
        skip: (page - 1) * PER_PAGE,
        limit: PER_PAGE,
      }),
    queryKey: ["roles", { page }],
  };
}

export default function RoleTable() {
  const queryClient = useQueryClient();
  const { page } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  // Utility to update 'page' in the query string
  const setPage = (newPage: number) =>
    navigate({
      search: (prev: any) => ({ ...prev, page: newPage.toString() }),
    });

  const {
    data: roles,
    isPending,
    isPlaceholderData,
  } = useQuery({
    ...getRolesQueryOptions({ page }),
    placeholderData: (prevData) => prevData,
  });

  const hasNextPage = !isPlaceholderData && roles?.data.length === PER_PAGE;
  const hasPreviousPage = page > 1;

  useEffect(() => {
    if (hasNextPage) {
      queryClient.prefetchQuery(getRolesQueryOptions({ page: page + 1 }));
    }
  }, [page, queryClient, hasNextPage]);

  return (
    <>
      <div className="w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[20%]">Role ID</TableHead>
              <TableHead className="w-[50%]">Role Name</TableHead>
            </TableRow>
          </TableHeader>
          {isPending ? (
            /* If you're using a ShadCN Skeleton component: */
            <TableBody>
              <TableRow>
                {new Array(4).fill(null).map((_, index) => (
                  <TableCell key={index}>
                    <Skeleton className="h-4 w-full mb-2" />
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {roles?.data.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="max-w-[150px] truncate text-inherit">
                    {role.id || "N/A"}
                  </TableCell>
                  <TableCell className="max-w-[150px] truncate">
                    {role.name}
                  </TableCell>
                  <TableCell>
                    <ActionsMenu
                      type="Role"
                      value={role}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </div>

      <PaginationFooter
        onChangePage={setPage}
        page={page}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
      />
    </>
  );
}
