import type {
	IDashboardStrategy,
	IDashboardStrategyFactory,
} from '@/interface/dashboard-strategy.interface'
import { TABLE_TYPE } from '@/interface/table-mediator.interface'
import { ProductStrategy } from '../product.strategy'
import { CategoryStrategy } from '../category.strategy'
import { OrderStrategy } from '../order.strategy'

export class AllModeStrategyFactory implements IDashboardStrategyFactory {
	private readonly strategies: Map<keyof typeof TABLE_TYPE, IDashboardStrategy>
	constructor() {
		this.strategies = new Map([
			['PRODUCTS', new ProductStrategy()],
			['CATEGORIES', new CategoryStrategy()],
			['ORDERS', new OrderStrategy()],
		])
	}

	public getStrategy(type: keyof typeof TABLE_TYPE): IDashboardStrategy | undefined {
		return this.strategies.get(type)
	}
}
