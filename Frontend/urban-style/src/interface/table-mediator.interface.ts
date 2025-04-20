import type { Table } from "@tanstack/table-core";

export interface ITableMediator {
  tableConfig: () => { tableConfig: Table<unknown> };
}
