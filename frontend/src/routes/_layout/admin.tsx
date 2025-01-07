
import { z } from "zod";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { type UserPublic, UsersService } from "../../client";
import AddUser from "../../components/Admin/AddUser";
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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

/** 
 * If your ShadCN setup doesn't include a Badge component, 
 * you can build a small one or just use a <span> with styling. 
 */
import { Badge } from "@/components/ui/badge";

/** 
 * For the skeleton/placeholder, ShadCN UI has a "Skeleton" component you can generate. 
 * Otherwise, you could replicate the Chakra Skeleton with a simple <div> or <p> that has 
 * tailwind classes like "animate-pulse bg-gray-200 rounded". 
 */
import { Skeleton } from "@/components/ui/skeleton"; // Example if you generated a Skeleton component
import Navbar from '@/components/Common/Navbar';

const usersSearchSchema = z.object({
  page: z.number().catch(1),
});

export const Route = createFileRoute("/_layout/admin")({
  component: Admin,
  validateSearch: (search) => usersSearchSchema.parse(search),
});

const PER_PAGE = 5;

function getUsersQueryOptions({ page }: { page: number }) {
  return {
    queryFn: () =>
      UsersService.readUsers({ skip: (page - 1) * PER_PAGE, limit: PER_PAGE }),
    queryKey: ["users", { page }],
  };
}

function UsersTable() {
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

function Admin() {
  return (
    <div className="container mx-auto">
      <Card className="mt-12">
        <CardHeader>
          <CardTitle className="text-2xl text-center md:text-left">
            Users Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* A simple 'Navbar' or top bar with a button to AddUser, etc. */}
          <Navbar type="User" addModalAs={AddUser} />
          <UsersTable />
        </CardContent>
      </Card>
    </div>
  );
}

export default Admin;
