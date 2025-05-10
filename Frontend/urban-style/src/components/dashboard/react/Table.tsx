import { flexRender } from "@/lib/table-config";
import TableActions from "./TableActions";
import type { BaseDocument } from "@/interface/base.interface";
import { useTable } from "./hooks/useTable";

export default function Table() {
  const { tableConfig } = useTable();

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
              <td
                key={cell.id}
                className="max-w-72 min-h-11 px-4 py-2 border border-border text-center"
              >
                {flexRender(
                  cell.column.id === "actions" ? (
                    <TableActions id={(row.original as BaseDocument).id} />
                  ) : (
                    cell.column.columnDef?.cell
                  ),
                  cell.getContext()
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
