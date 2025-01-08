
import { z } from "zod";
import { createFileRoute } from "@tanstack/react-router";
import AddUser from "../../components/Admin/AddUser";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import Navbar from '@/components/Common/Navbar';
import UsersTable from '@/components/Admin/UserTable';
import RoleTable from '@/components/Admin/RoleTable';
import AddRole from '@/components/Admin/AddRole';

const usersSearchSchema = z.object({
  page: z.number().catch(1),
});

export const Route = createFileRoute("/_layout/admin")({
  component: Admin,
  validateSearch: (search) => usersSearchSchema.parse(search),
});


function Admin() {
  return (
    <div className=" mx-auto">
      <Card className="mt-3">
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
      <Card className="mt-3">
        <CardHeader>
          <CardTitle className="text-2xl text-center md:text-left">
            Roles Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* A simple 'Navbar' or top bar with a button to AddUser, etc. */}
          <Navbar type="Role" addModalAs={AddRole} />
          <RoleTable />
        </CardContent>
      </Card>
    </div>
  );
}

export default Admin;
