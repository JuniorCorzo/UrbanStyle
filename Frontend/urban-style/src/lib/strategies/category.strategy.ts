import type { IDashboardStrategy } from '@/interface/dashboard-strategy.interface'
import { categoriesForm } from '../mediators/category-form.mediator'
import { categoriesTable } from '../mediators/category-table.mediator'
import { dashboardStats } from '../mediators/dashboard-stats.mediator'

export class CategoryStrategy implements IDashboardStrategy {
	execute() {
		categoriesTable()
		categoriesForm()
		dashboardStats()
	}
}
