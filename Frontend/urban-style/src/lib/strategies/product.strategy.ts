import type { IDashboardStrategy } from '@/interface/dashboard-strategy.interface'
import { productTable } from '../mediators/product-table.mediator'
import { productForm } from '../mediators/product-form.mediator'

export class ProductStrategy implements IDashboardStrategy {
	execute() {
		productTable()
		productForm()
	}
}
