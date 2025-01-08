
import { useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { type UserPublic, UsersService } from "../../client";
import ActionsMenu from "../../components/Common/ActionsMenu";
import { PaginationFooter } from "../../components/Common/PaginationFooter";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Route } from '@/routes/_layout/admin';


const PER_PAGE = 5;

function getUsersQueryOptions({ page }: { page: number }) {
  return {
    queryFn: () =>
      UsersService.readUsers({ skip: (page - 1) * PER_PAGE, limit: PER_PAGE }),
    queryKey: ["users", { page }],
  };
}

export default function UsersTable() {
  const queryClient = useQueryClient();
  const currentUser = queryClient.getQueryData<UserPublic>(["currentUser"]);
  const { page } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  // Utility to update 'page' in the query string
  const setPage = (newPage: number) =>
    navigate({
      search: (prev: any) => ({ ...prev, page: newPage.toString() }),
    });

  const {
    data: users,
    isPending,
    isPlaceholderData,
  } = useQuery({
    ...getUsersQueryOptions({ page }),
    placeholderData: (prevData) => prevData,
  });

  const hasNextPage = !isPlaceholderData && users?.data.length === PER_PAGE;
  const hasPreviousPage = page > 1;

  useEffect(() => {
    if (hasNextPage) {
      queryClient.prefetchQuery(getUsersQueryOptions({ page: page + 1 }));
    }
  }, [page, queryClient, hasNextPage]);

  return (
    <>
      <div className="w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[20%]">Full name</TableHead>
              <TableHead className="w-[50%]">Email</TableHead>
              <TableHead className="w-[10%]">Role</TableHead>
              <TableHead className="w-[10%]">Status</TableHead>
              <TableHead className="w-[10%]">Created at</TableHead>
              <TableHead className="w-[10%]">Updated at</TableHead>             
              <TableHead className="w-[10%]">Actions</TableHead>
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
              {users?.data.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="max-w-[150px] truncate text-inherit">
                    {user.full_name || "N/A"}
                    {currentUser?.id === user.id && (
                      <Badge variant="outline" className="ml-2">
                        You
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="max-w-[150px] truncate">
                    {user.email}
                  </TableCell>
                  <TableCell>
                    {user.is_superuser ? "Superuser" : "User"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {/* Circle indicating status */}
                      <div
                        className={`w-2 h-2 rounded-full ${
                          user.is_active ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                      {user.is_active ? "Active" : "Inactive"}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[150px] truncate">
                    {user.created_at}
                  </TableCell>
                  <TableCell className="max-w-[150px] truncate">
                    {user.updated_at}
                  </TableCell>
                  <TableCell>
                    <ActionsMenu
                      type="User"
                      value={user}
                      disabled={currentUser?.id === user.id}
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


