// src/components/layout/Sidebar.tsx

import { useState, useEffect } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FiChevronsLeft, FiChevronsRight } from "react-icons/fi";
import { menuItems } from "@/config/RoleBaseNav";

export default function Sidebar({ onToggleExpand }: any) {
  const router = useRouter();
  const pathname = router.state.location.pathname;
  const [expanded, setExpanded] = useState(false);

  // 사이드바 너비에 따른 CSS 변수 업데이트
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--sidebar-width", expanded ? "16rem" : "4rem");
    onToggleExpand(expanded);
  }, [expanded, onToggleExpand]);

  return (
    <aside
      className={cn(
        "fixed top-14 bottom-0 pt-2 bg-white border-r border-gray-200",
        "transition-width duration-300 ease-in-out",
        "flex flex-col px-[5px]",
        expanded ? "w-52" : "w-16",
        "hidden sm:block"
      )}
    >
      <nav className="flex-1 overflow-hidden">
        <ul className="space-y-3 py-4">
          {menuItems.map((item) => (
            <li key={item.name} className="flex justify-start w-full">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      to={item.href}
                      className={cn(
                        "flex items-center py-3 px-4 text-sm font-normal rounded-md",
                        pathname === item.href
                          ? "text-blue-600 bg-gray-100"
                          : "hover:text-blue-600 text-accent-foreground"
                      )}
                    >
                      <item.icon
                        className={cn("h-[19px] w-[19px]", expanded ? "mr-3" : "mx-auto")}
                      />
                      {expanded && (
                        <span
                          className={cn(
                            "w-40 transition-all duration-300 ease-in-out",
                            expanded
                              ? "flex opacity-100 max-w-full visibility-visible"
                              : "hidden opacity-0 max-w-0 visibility-hidden"
                          )}
                        >
                          {item.name}
                        </span>
                      )}
                    </Link>
                  </TooltipTrigger>
                  {!expanded && (
                    <TooltipContent side="right">
                      <p>{item.name}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </li>
          ))}
        </ul>
      </nav>
      <Button
        variant="ghost"
        className="flex w-full h-16 justify-center rounded-none border-t border-gray-200 hover:bg-gray-100"
        size="icon"
        onClick={() => setExpanded(!expanded)}
        style={{ position: "absolute", bottom: 0, left: 0, right: 0 }} // 하단 고정
      >
        {expanded ? (
          <FiChevronsLeft className="h-5 w-5" />
        ) : (
          <FiChevronsRight className="h-5 w-5" />
        )}
      </Button>
    </aside>
  );
}
