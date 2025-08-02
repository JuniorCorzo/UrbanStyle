import type { IDashboardStrategy } from '@/interface/dashboard-strategy.interface'
import { categoryReportTable } from '../mediators/category-table.mediator'
import { categoriesForm } from '../mediators/category-form.mediator'

export class CategoryReportStrategy implements IDashboardStrategy {
	execute() {
		categoryReportTable()
		categoriesForm()
	}
}
