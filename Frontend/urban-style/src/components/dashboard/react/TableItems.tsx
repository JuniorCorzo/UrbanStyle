import { useTableItems } from "./hooks/useTableItems";
import Table from "./Table";

export function TableItems() {
  const { tableConfig } = useTableItems();
  return <Table tableConfig={tableConfig} />;
}
