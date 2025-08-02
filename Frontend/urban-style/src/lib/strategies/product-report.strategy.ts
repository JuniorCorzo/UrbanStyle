import type { IDashboardStrategy } from '@/interface/dashboard-strategy.interface'
import { productReportTable } from '../mediators/product-table.mediator'
import { productForm } from '../mediators/product-form.mediator'
import { dashboardStats } from '../mediators/dashboard-stats.mediator'

export class ProductReportStrategy implements IDashboardStrategy {
	execute() {
		productReportTable()
		productForm()
		dashboardStats()
	}
}
