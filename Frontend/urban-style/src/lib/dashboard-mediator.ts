import { TABLE_MODE, TABLE_TYPE, type DashboardContext } from '@/interface/table-mediator.interface'
import { AllModeStrategyFactory } from './strategies/factory/all.strategy-factory'
import type { IDashboardStrategyFactory } from '@/interface/dashboard-strategy.interface'
import { getEnumKeyByValue } from './utils/enum-utils'
import { ReportStrategyFactory } from './strategies/factory/report.strategy-factory'
import { InventoryStrategyFactory } from './strategies/factory/inventory.strategy_factory'

export async function DashboardMediator(
	mode: string | null,
	type: string | null,
): Promise<DashboardContext> {
	if (!type || !mode) return

	const MediatorStrategies = new Map<keyof typeof TABLE_MODE, IDashboardStrategyFactory>([
		['ALL', new AllModeStrategyFactory()],
		['REPORT', new ReportStrategyFactory()],
		['INVENTORY', new InventoryStrategyFactory()],
	])

	const modeKey = getEnumKeyByValue(TABLE_MODE, mode) ?? 'ALL'
	const typeKey = getEnumKeyByValue(TABLE_TYPE, type) ?? 'PRODUCTS'

	let strategyFactory
	if (typeContainsMode(modeKey, typeKey)) {
		strategyFactory = MediatorStrategies.get(modeKey)
	} else {
		strategyFactory = MediatorStrategies.get('ALL')
	}

	strategyFactory?.getStrategy(typeKey)?.execute()
}

function typeContainsMode(mode: keyof typeof TABLE_MODE, type: keyof typeof TABLE_TYPE): boolean {
	const modeWithTypes: Map<keyof typeof TABLE_MODE, (keyof typeof TABLE_TYPE)[]> = new Map([
		['ALL', ['PRODUCTS', 'CATEGORIES', 'ORDERS']],
		['REPORT', ['PRODUCTS', 'CATEGORIES']],
		['INVENTORY', ['PRODUCTS']],
	])

	return !!modeWithTypes.get(mode)?.includes(type)
}
