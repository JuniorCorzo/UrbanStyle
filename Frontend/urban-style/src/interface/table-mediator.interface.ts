import type { FilterDropdownRefProps } from '@/components/dashboard/react/components/table/filters/FiltersDropdown'
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

export interface TableState {
	columns: ColumnDef<unknown, any>[]
	data: unknown[]
	searchFilter?: string
	columnPinning?: ColumnPinningState
	columnFilters?: ColumnFiltersState
	filterComponent?: (ref: React.RefObject<FilterDropdownRefProps | null>) => React.ReactNode
	canExpand?: boolean
	subComponent?: SubComponent<unknown>
}
