// src/components/layout/Breadcrumb.tsx
import { useRouter } from "@tanstack/react-router";
import { BreadcrumbItems } from "@/types/ui";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function BreadcrumbComp() {
  const router = useRouter();
  const pathname = router.state.location.pathname;
  const pathSegments = pathname.split("/").filter(Boolean);
  const breadcrumbItems: BreadcrumbItems[] = pathSegments.map(
    (segment, index) => ({
      label: segment.charAt(0).toUpperCase() + segment.slice(1),
      href: "/" + pathSegments.slice(0, index + 1).join("/"),
    })
  );
  return (
    <Breadcrumb className="hidden sm:block">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        {breadcrumbItems.map((item, index) => (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem key={index}>
              <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
            </BreadcrumbItem>
          </>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}


