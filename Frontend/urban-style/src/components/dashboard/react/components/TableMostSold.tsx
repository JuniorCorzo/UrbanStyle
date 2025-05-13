import { useTableMostSold } from "../hooks/useTableMostSold";
import Table from "../Table";

export default function TableMostSold() {
  const { tableConfig } = useTableMostSold();

  return <Table tableConfig={tableConfig} />;
}
