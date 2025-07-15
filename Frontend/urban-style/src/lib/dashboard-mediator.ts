import { productTable } from './mediators/product-table.mediator'
import { TABLE_MEDIATOR_METADATA } from '@/const/table-mediator.const'
import { categoriesTable } from './mediators/category-table.mediator'
import type { FormMediator } from '@/interface/form-mediator.interface'
import { productForm } from './mediators/product-form.mediator'
import { categoriesForm } from './mediators/category-form.mediator'
import type { TableConfig } from '@/interface/table-mediator.interface'
import { orderTable } from './mediators/order-table.mediator'

export async function DashboardMediator(
	mediator: string | null,
	id?: string,
): Promise<{ table: TableConfig; form: FormMediator | null } | undefined> {
	const { categoriesSearchParam, productsSearchParam, orderSearchParam } = TABLE_MEDIATOR_METADATA

	switch (mediator) {
		case productsSearchParam:
			return {
				table: productTable,
				form: await productForm(),
			}
		case categoriesSearchParam:
			return { table: categoriesTable, form: await categoriesForm() }
		case orderSearchParam:
			return { table: orderTable, form: null }
		default:
			return undefined
	}
}
