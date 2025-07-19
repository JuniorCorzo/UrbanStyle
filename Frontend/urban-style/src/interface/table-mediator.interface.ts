import type {
	ColumnDef,
	ColumnFiltersState,
	ColumnPinningState,
	Row,
	Table,
} from '@tanstack/react-table'
import type React from 'react'

export type ITable = Table<unknown>
export type TableConfig = () => void

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
