"use client";

import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function DataTable<TData, TValue>({
  columns,
  data,
  searchPlaceholder = "Buscar…",
  emptyState,
}: {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchPlaceholder?: string;
  emptyState?: React.ReactNode;
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-ink-subtle)]" />
        <input
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder={searchPlaceholder}
          className="field !pl-10"
          aria-label={searchPlaceholder}
        />
      </div>

      <div className="card-velvet overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[oklch(0.20_0.02_55)] text-left">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    className="accent text-[0.6rem] text-[var(--color-ink-subtle)] px-5 py-3"
                  >
                    {header.isPlaceholder ? null : header.column.getCanSort() ? (
                      <button
                        type="button"
                        onClick={header.column.getToggleSortingHandler()}
                        className="inline-flex items-center gap-1 hover:text-[var(--color-gold)]"
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        <ArrowUpDown className="h-3 w-3" />
                      </button>
                    ) : (
                      flexRender(header.column.columnDef.header, header.getContext())
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-5 py-12 text-center text-[var(--color-ink-subtle)]">
                  {emptyState ?? "Sin resultados"}
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row, i) => (
                <tr
                  key={row.id}
                  className={cn(
                    "border-t border-[oklch(0.55_0.10_70_/_0.15)] hover:bg-[oklch(0.78_0.13_82_/_0.04)]",
                    i % 2 === 1 && "bg-[oklch(0.18_0.020_55_/_0.4)]",
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-5 py-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <nav className="flex items-center justify-between" aria-label="Paginación">
        <p className="text-xs text-[var(--color-ink-subtle)]">
          {table.getFilteredRowModel().rows.length} resultados · página {table.getState().pagination.pageIndex + 1} de{" "}
          {table.getPageCount() || 1}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="p-2 rounded-md border border-[oklch(0.55_0.10_70_/_0.3)] text-[var(--color-ink-muted)] disabled:opacity-30"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="p-2 rounded-md border border-[oklch(0.55_0.10_70_/_0.3)] text-[var(--color-ink-muted)] disabled:opacity-30"
            aria-label="Siguiente"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </nav>
    </div>
  );
}
