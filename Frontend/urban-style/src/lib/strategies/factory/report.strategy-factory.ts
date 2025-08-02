import type {
	IDashboardStrategy,
	IDashboardStrategyFactory,
} from '@/interface/dashboard-strategy.interface'
import type { TABLE_TYPE } from '@/interface/table-mediator.interface'
import { ProductReportStrategy } from '../product-report.strategy'
import { CategoryReportStrategy } from '../category-report.strategy'

export class ReportStrategyFactory implements IDashboardStrategyFactory {
	private readonly strategies: Map<keyof typeof TABLE_TYPE, IDashboardStrategy>

	constructor() {
		this.strategies = new Map([
			['PRODUCTS', new ProductReportStrategy()],
			['CATEGORIES', new CategoryReportStrategy()],
		])
	}

	getStrategy(type: keyof typeof TABLE_TYPE): IDashboardStrategy | undefined {
		return this.strategies.get(type)
	}
}
