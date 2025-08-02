import type { IDashboardStrategy } from '@/interface/dashboard-strategy.interface'
import { productTable } from '../mediators/product-table.mediator'
import { productForm } from '../mediators/product-form.mediator'
import { dashboardStats } from '../mediators/dashboard-stats.mediator'

export class ProductStrategy implements IDashboardStrategy {
	execute() {
		productTable()
		productForm()
		dashboardStats()
	}
}
