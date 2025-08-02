import type {
	ColumnDef,
	ColumnFiltersState,
	ColumnPinningState,
	Row,
	Table,
} from '@tanstack/react-table'
import type React from 'react'
import type { FormMediator } from './form-mediator.interface'

export enum TABLE_PARAM {
	MODE = 'mode',
	TYPE = 'type',
}

export enum TABLE_MODE {
	ALL = 'all',
	REPORT = 'report',
}

export enum TABLE_TYPE {
	PRODUCTS = 'products',
	CATEGORIES = 'category',
	ORDERS = 'orders',
}

export type ITable = Table<unknown>
export type TableConfig = () => void

export type DashboardContext = { table: TableConfig; form: FormMediator | null } | undefined

export interface SubComponentProps<T> {
	row: Row<T>
}

export type SubComponent<T> = (props: SubComponentProps<T>) => React.ReactNode
export type FilterComponents = {
	right?: () => React.ReactNode
	left?: () => React.ReactNode
}

export interface TableState {
	columns: ColumnDef<unknown, any>[]
	data: unknown[]
	canSearch?: boolean
	searchFilter?: string
	columnPinning?: ColumnPinningState
	columnFilters?: ColumnFiltersState
	filterComponents?: FilterComponents
	canExpand?: boolean
	subComponent?: SubComponent<unknown>
	hasForm?: boolean
}
