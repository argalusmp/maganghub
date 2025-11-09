import { Button } from "@/components/ui/button";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const canPrev = page > 1;
  const canNext = page < totalPages;
  const pageItems = buildPageItems(page, totalPages);

  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/5 bg-zinc-900/70 px-4 py-3">
      <p className="text-sm text-zinc-400">Halaman {page} dari {totalPages}</p>
      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" variant="outline" size="sm" disabled={!canPrev} onClick={() => canPrev && onPageChange(page - 1)}>
          Sebelumnya
        </Button>
        {pageItems.map((item, index) =>
          item === "ellipsis" ? (
            <span key={`ellipsis-${index}`} className="px-2 text-sm text-zinc-400">
              ...
            </span>
          ) : (
            <Button
              key={item}
              type="button"
              size="sm"
              variant={item === page ? "default" : "outline"}
              aria-current={item === page ? "page" : undefined}
              onClick={() => onPageChange(item)}
            >
              {item}
            </Button>
          )
        )}
        <Button type="button" size="sm" disabled={!canNext} onClick={() => canNext && onPageChange(page + 1)}>
          Selanjutnya
        </Button>
      </div>
    </div>
  );
}

function buildPageItems(current: number, total: number): Array<number | "ellipsis"> {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, total, current]);
  const neighbors = [current - 1, current + 1];
  neighbors.forEach((value) => {
    if (value > 1 && value < total) {
      pages.add(value);
    }
  });

  const items = Array.from(pages).sort((a, b) => a - b);
  const result: Array<number | "ellipsis"> = [];

  for (let i = 0; i < items.length; i += 1) {
    const value = items[i];
    const prev = items[i - 1];
    if (prev && value - prev > 1) {
      result.push("ellipsis");
    }
    result.push(value);
  }

  return result;
}
