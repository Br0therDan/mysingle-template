import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import Sidebar from "@/components/layout/Sidebar";
import useAuth, { isLoggedIn } from "../hooks/useAuth";
import { useState } from "react";
import Header from "@/components/layout/Header";
import { BreadcrumbComp } from '@/components/layout/BreadcrumbComp';


export const Route = createFileRoute("/_layout")({
  component: Layout,
  beforeLoad: async () => {
    if (!isLoggedIn()) {
      throw redirect({ to: "/login" });
    }
  },
});

function Layout() {
  const { isLoading } = useAuth();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar onToggleExpand={setIsSidebarExpanded} />
        <main
          className={`flex-grow container mx-auto mt-16 p-4 transition-all duration-300 ${
            isSidebarExpanded ? "ml-64" : "ml-16"
          }`}
        >
          <BreadcrumbComp />
          <div className="p-4 min-h-screen">
            {isLoading ? (
              <div className="flex items-center justify-center w-full h-screen">
                <div className="spinner"></div>
              </div>
            ) : (
              <Outlet />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Layout;
