import type { Category } from "@/interface/category.interface";
import type { ITableMediator } from "@/interface/table-mediator.interface";
import { createColumnHelper } from "@tanstack/table-core";
import { createTableConfig } from "../table-config";
import { getAllCategories } from "@/service/categories.service";

export async function categoriesTable(): Promise<ITableMediator> {
  const categories = await getAllCategories();
  const columnAccessor = createColumnHelper<Category>();
  const columns = [
    columnAccessor.accessor("name", {
      header: "Nombre",
    }),
    columnAccessor.accessor("description", {
      header: "Descripción",
    }),
  ];

  const tableConfig = () => {
    return createTableConfig(columns, categories);
  };

  return {
    tableConfig,
  };
}
