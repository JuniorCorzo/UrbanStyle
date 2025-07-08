import { productTable } from './mediators/product-table.mediator'
import { TABLE_MEDIATOR_METADATA } from '@/const/table-mediator.const'
import { categoriesTable } from './mediators/category-table.mediator'
import type { FormMediator } from '@/interface/form-mediator.interface'
import { productForm } from './mediators/product-form.mediator'
import { categoriesForm } from './mediators/category-form.mediator'
import type { TableConfig } from '@/interface/table-mediator.interface'

export async function DashboardMediator(
	mediator: string | null,
	id?: string,
): Promise<{ table: TableConfig; form: FormMediator } | undefined> {
	const {
		categoriesSearchParam: categories_search_param,
		productsSearchParam: products_search_param,
	} = TABLE_MEDIATOR_METADATA

	switch (mediator) {
		case products_search_param:
			return {
				table: productTable,
				form: await productForm(),
			}
		case categories_search_param:
			return { table: categoriesTable, form: await categoriesForm() }
		default:
			return undefined
	}
}
