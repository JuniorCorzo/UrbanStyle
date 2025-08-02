import type { TABLE_TYPE } from './table-mediator.interface'

export interface IDashboardStrategyFactory {
	getStrategy: (type: keyof typeof TABLE_TYPE) => IDashboardStrategy | undefined
}

export interface IDashboardStrategy {
	execute: () => void // set global state for table and form
}
