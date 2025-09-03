import type { IDashboardStrategy } from '@/interface/dashboard-strategy.interface'
import { productInventoryTable } from '../mediators/product-table.mediator'

export class ProductInventoryStrategy implements IDashboardStrategy {
	execute(): void {
		productInventoryTable()
	}
}
