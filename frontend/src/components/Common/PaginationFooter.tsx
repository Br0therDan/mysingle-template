import { Button } from "@/components/ui/button";

type PaginationFooterProps = {
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  onChangePage: (newPage: number) => void;
  page: number;
};

export function PaginationFooter({
  hasNextPage,
  hasPreviousPage,
  onChangePage,
  page,
}: PaginationFooterProps) {
  return (
    <div className="flex items-center justify-end gap-4 mt-4">
      <Button
        variant="outline"
        onClick={() => onChangePage(page - 1)}
        disabled={!hasPreviousPage || page <= 1}
      >
        Previous
      </Button>
      <span>Page {page}</span>
      <Button
        variant="outline"
        onClick={() => onChangePage(page + 1)}
        disabled={!hasNextPage}
      >
        Next
      </Button>
    </div>
  );
}
