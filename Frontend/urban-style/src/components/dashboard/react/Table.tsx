import { flexRender } from "@/lib/table-config";
import TableActions from "./TableActions";
import type { BaseDocument } from "@/interface/base.interface";
import Cell from "./Cell";
import type { ITable } from "@/interface/table-mediator.interface";
import { useState } from "react";

interface Props {
  tableConfig: ITable | undefined;
}

export default function Table({ tableConfig }: Props) {
  return (
    <table className="table w-full border border-border">
      <thead className="h-11 bg-accent text-center">
        {tableConfig?.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id}>
                {flexRender(
                  header.column.columnDef?.header,
                  header.getContext()
                )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {tableConfig?.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <Cell key={cell.id}>
                {flexRender(
                  cell.column.id === "actions" ? (
                    <TableActions id={(row.original as BaseDocument).id} />
                  ) : (
                    cell.column.columnDef?.cell
                  ),
                  cell.getContext()
                )}
              </Cell>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
