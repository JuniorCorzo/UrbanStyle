import type { ITableMediator } from "@/interface/table-mediator.interface";
import { productTable } from "./product-table";
import { TABLE_MEDIATOR_METADATA } from "@/const/table-mediator.const";
import { categoriesTable } from "./category-table";

export async function TableMediator(
  mediator: string
): Promise<ITableMediator | undefined> {
  const {
    categoriesSearchParam: categories_search_param,
    productsSearchParam: products_search_param,
  } = TABLE_MEDIATOR_METADATA;

  switch (mediator) {
    case products_search_param:
      return await productTable();
    case categories_search_param:
      return await categoriesTable();
    default:
      return undefined;
  }
}
