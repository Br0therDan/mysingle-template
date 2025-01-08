import { Outlet, createFileRoute, redirect, useMatches, useRouter } from "@tanstack/react-router";
import Sidebar from "@/components/layout/Sidebar";
import useAuth, { isLoggedIn } from "../hooks/useAuth";
import { useState } from "react";
import Header from "@/components/layout/Header";
import { BreadcrumbComp } from "@/components/layout/BreadcrumbComp";
import PageTitle from '@/components/layout/PageTitle';

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

  // 1) 현재 매칭된 라우트 배열
  const matches = useMatches()

  // 2) router 객체
  const router = useRouter()

  // 3) 가장 하위 매치
  const lastMatch = matches[matches.length - 1]

  // 4) routeId로 라우트 정의를 찾는다
  let pageTitle = "No Title"
  if (lastMatch?.routeId) {
    // 라우트 ID 예시: '/_layout/items'
    const routerAny = router as any // TS 오류 시 임시로 any 단언
    const routeNode = routerAny.routesById?.[lastMatch.routeId]
    pageTitle = routeNode?.options?.meta?.title ?? "No Title"
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar onToggleExpand={setIsSidebarExpanded} />
        <main
          className={`flex-grow bg-background mx-auto p-2 w-full ml-0 transition-all duration-300 ${
            isSidebarExpanded ? "sm:ml-52" : "sm:ml-16"
          }`}
        >
          
          <div className="flex justify-center md:p-2 min-h-screen">
            {isLoading ? (
              <div className="w-full max-w-[1000px] p-3 md:gap-4 md:p-4">
                <div className="spinner"></div>
              </div>
            ) : (
              <div className="w-full space-y-2 p-6 sm:max-w-[1000px] sm:min-w-[500px] md:gap-4 md:p-4">
                <BreadcrumbComp />
                {/* PageTitle에 meta.title을 넘긴다 */}
                <PageTitle />
                <Outlet />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Layout;
