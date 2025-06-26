import type { Products } from "@/interface/product.interface";
import type {
  ITableMediator,
  TableConfig,
} from "@/interface/table-mediator.interface";
import { createColumnHelper } from "@tanstack/table-core";
import { createTableConfig } from "../table-config";
import { ProductStore } from "@/state/product.store";
import { ReportService } from "@/service/report.service";
import type { BestSeller } from "@/interface/report.interface";

export async function productTable(): Promise<ITableMediator> {
  const products = (await ProductStore()).productStore.get();

  //TODO: Refactor the table configuration into another file only to manage table logic
  const columnAccessor = createColumnHelper<Products>();
  const columns = [
    columnAccessor.accessor("name", {
      header: "Nombre",
    }),
    columnAccessor.accessor("description", {
      header: "Descripción",
    }),
    columnAccessor.accessor("price", {
      header: "Precio",
    }),
    columnAccessor.accessor("categories", {
      header: "Categorías",
      cell: (info) =>
        info
          .getValue()
          .map((category) => category.name)
          .join(", "),
    }),
    columnAccessor.accessor("stock", {
      header: "Stock",
      cell: (info) => `${info.getValue()} Unidades`,
    }),
    columnAccessor.accessor("discount", {
      header: "Descuento",
    }),
    // columnAccessor.accessor("attributes", {
    //   header: "Atributos",
    //   cell: (info) =>
    //     `Color: ${info.getValue()?.map(({ color }) => color)} Talla: ${info
    //       .getValue()
    //       ?.map(({ size }) => size)}`,
    // }),
  ];

  const requestMoreSold = await ReportService().productsMoreSold();

  const productMoreSold = async (): Promise<TableConfig> => {
    const columnAccessor = createColumnHelper<BestSeller>();
    const columns = [
      columnAccessor.accessor("name", {
        header: "Producto",
      }),
      columnAccessor.accessor("sold", {
        header: "Vendido",
      }),
    ];

    const tableCreated = createTableConfig(columns, requestMoreSold);

    return () => tableCreated;
  };

  const tableConfig = () => {
    return createTableConfig(columns, products);
  };

  return {
    tableConfig,
    mostSoldTable: await productMoreSold(),
  };
}
