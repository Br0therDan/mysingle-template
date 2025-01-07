import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useAuth from "../../hooks/useAuth";

export const Route = createFileRoute("/_layout/")({
  component: Dashboard,
});

function Dashboard() {
  const { user: currentUser } = useAuth();

  return (
    <div className="container mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Hi, {currentUser?.full_name || currentUser?.email} 👋🏼</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Welcome back, nice to see you again!</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default Dashboard;
