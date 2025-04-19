import type { Products } from "@/interface/product.interface";
import type { ITableMediator } from "@/interface/table-mediator.interface";
import { getAllProducts } from "@/service/product.service";
import { createColumnHelper, type Table } from "@tanstack/table-core";
import { createTableConfig } from "../table-config";

export async function productTable(): Promise<ITableMediator> {
  const products = await getAllProducts();

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
          .map((category) => category)
          .join(", "),
    }),
    columnAccessor.accessor("stock", {
      header: "Stock",
      cell: (info) => `${info.getValue()} Unidades`,
    }),
    columnAccessor.accessor("discount", {
      header: "Descuento",
    }),
    columnAccessor.accessor("attributes", {
      header: "Atributos",
      cell: (info) =>
        `Color: ${info.getValue().color} Talla: ${info.getValue().size}`,
    }),
  ];

  const tableConfig = () => {
    return createTableConfig(columns, products);
  };

  return {
    tableConfig,
  };
}
