import type {
	IDashboardStrategy,
	IDashboardStrategyFactory,
} from '@/interface/dashboard-strategy.interface'
import type { TABLE_TYPE } from '@/interface/table-mediator.interface'
import { ProductInventoryStrategy } from '../product_inventory.strategy'

export class InventoryStrategyFactory implements IDashboardStrategyFactory {
	private readonly strategies: Map<keyof typeof TABLE_TYPE, IDashboardStrategy>
	constructor() {
		this.strategies = new Map([['PRODUCTS', new ProductInventoryStrategy()]])
	}

	getStrategy(type: keyof typeof TABLE_TYPE): IDashboardStrategy | undefined {
		return this.strategies.get(type)
	}
}
