import type { Category } from "@/interface/category.interface";
import type {
  ITableMediator,
  TableConfig,
} from "@/interface/table-mediator.interface";
import { createColumnHelper } from "@tanstack/table-core";
import { createTableConfig } from "../table-config";
import { CategoriesStore } from "@/state/categories.store";
import { ReportService } from "@/service/report.service";
import type { BestSeller } from "@/interface/report.interface";
import { ReportStore } from "@/state/report.store";

export async function categoriesTable(): Promise<ITableMediator> {
  const categories = (await CategoriesStore()).categoriesStore.get();
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

  const categoriesMoreSold = async (): Promise<TableConfig> => {
    const requestMoreSold = await ReportStore().getCategoriesMoreSold();
    const columnAccessor = createColumnHelper<BestSeller>();
    const columns = [
      columnAccessor.accessor("name", {
        header: "Categoría",
      }),
      columnAccessor.accessor("sold", {
        header: "Vendido",
      }),
    ];

    const tableCreated = createTableConfig(columns, requestMoreSold);

    return () => tableCreated;
  };

  return {
    tableConfig,
    mostSoldTable: await categoriesMoreSold(),
  };
}
