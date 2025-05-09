import type { ITable } from "@/interface/table-mediator.interface";
import { selectMediator } from "@/lib/utils/select-mediator";
import type { ColumnDef } from "@tanstack/table-core";
import { useEffect, useState } from "react";

export function useTable() {
  const [tableConfig, setTableConfig] = useState<ITable>();
  const searchParam = new URLSearchParams();

  const getTableConfig = async () => {
    const table = (await selectMediator())?.table.tableConfig();
    if (!table) return;
    handleTable(table.tableConfig);
  };

  const handleTable = (tableConfig: ITable) => {
    const actionsColumns: ColumnDef<unknown> = {
      id: "actions",
      header: "Acciones",
    };

    tableConfig?.setOptions((prev: any) => ({
      ...prev,
      columns: [...prev.columns, actionsColumns],
    }));

    setTableConfig(tableConfig);
  };

  useEffect(() => {
    getTableConfig();
  }, [searchParam]);

  return {
    tableConfig,
  };
}
