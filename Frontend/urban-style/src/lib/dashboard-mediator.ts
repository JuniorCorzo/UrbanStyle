import type { ITableMediator } from "@/interface/table-mediator.interface";
import { productTable } from "./mediators/product-table.mediator";
import { TABLE_MEDIATOR_METADATA } from "@/const/table-mediator.const";
import { categoriesTable } from "./mediators/category-table.mediator";
import type { FormMediator } from "@/interface/form-mediator.interface";
import { productForm } from "./mediators/product-form.mediator";
import { categoriesForm } from "./mediators/category-form.mediator";

export async function DashboardMediator(
  mediator: string | null,
  id?: string
): Promise<{ table: ITableMediator; form: FormMediator } | undefined> {
  const {
    categoriesSearchParam: categories_search_param,
    productsSearchParam: products_search_param,
  } = TABLE_MEDIATOR_METADATA;

  switch (mediator) {
    case products_search_param:
      return {
        table: await productTable(),
        form: await productForm(),
      };
    case categories_search_param:
      return { table: await categoriesTable(), form: await categoriesForm() };
    default:
      return undefined;
  }
}
