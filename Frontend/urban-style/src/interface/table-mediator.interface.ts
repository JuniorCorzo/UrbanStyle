import type { Table } from "@tanstack/table-core";

export type ITable = Table<unknown>;
export type TableConfig = () => { tableConfig: ITable };

export interface ITableMediator {
  tableConfig: TableConfig;
}
