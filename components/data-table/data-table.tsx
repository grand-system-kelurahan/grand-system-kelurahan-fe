"use client";

import * as React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import ButtonRefresh from "../atoms/button-refresh";
import InputSearch from "../molecules/input-search";
import { DataTablePagination } from "./data-table-pagination";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filteringKey: string;
  filteringKeyAlt?: string;
  labelInput?: string;
  labelInputAlt?: string;
  refetch?: () => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filteringKey,
  filteringKeyAlt,
  labelInput = "Filter data",
  labelInputAlt = "Filter data",
  refetch,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div>
      <div className="flex justify-between items-center gap-4 pb-4">
        <InputSearch
          placeholder={labelInput}
          value={
            (table.getColumn(filteringKey)?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn(filteringKey)?.setFilterValue(event.target.value)
          }
        />
        {filteringKeyAlt && labelInputAlt && (
          <InputSearch
            placeholder={labelInputAlt}
            value={
              (table.getColumn(filteringKeyAlt)?.getFilterValue() as string) ??
              ""
            }
            onChange={(event) =>
              table
                .getColumn(filteringKeyAlt)
                ?.setFilterValue(event.target.value)
            }
          />
        )}

        {refetch && <ButtonRefresh onClick={refetch} />}
      </div>
      <div className="flex-1 text-muted-foreground text-sm">
        {table.getRowCount()} dari {data.length} data ditampilkan.
      </div>
      <div className="mt-2 border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                <TableHead>No</TableHead>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}>
                  <TableCell>{index + 1}</TableCell>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell className="h-24 text-center"></TableCell>
                <TableCell
                  colSpan={columns.length - 1}
                  className="h-24 text-center">
                  Data tidak ditemukan.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} />
    </div>
  );
}
