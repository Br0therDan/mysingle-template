// src/components/layout/Breadcrumb.tsx
"use client";
import { Link, useRouter } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { BreadcrumbItem } from "@/types/ui";

export default function Breadcrumb() {
  const router = useRouter();
  const pathname = router.state.location.pathname;
  const pathSegments = pathname.split("/").filter(Boolean);

  const breadcrumbItems: BreadcrumbItem[] = pathSegments.map(
    (segment, index) => ({
      label: segment.charAt(0).toUpperCase() + segment.slice(1),
      href: "/" + pathSegments.slice(0, index + 1).join("/"),
    })
  );

  return (
    <div className="h-12 w-full bg-white z-10 hidden md:flex ">
      <nav
        className="text-sm"
        aria-label="Breadcrumb"
      >
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link to="/" className="text-gray-700 hover:text-blue-600">
              Home
            </Link>
          </li>
          {breadcrumbItems.map((item, index) => (
            <li key={index}>
              <div className="flex items-center">
                <ChevronRight className="w-5 h-5 text-gray-400" />
                <Link
                  to={item.href}
                  className="ml-1 text-gray-700 hover:text-blue-600 md:ml-2"
                >
                  {item.label}
                </Link>
              </div>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}

// TODO: Implement custom labels for specific routes
// TODO: Add support for dynamic segments (e.g., [id])
