import { tableStore } from '@/state/table.state'
import { useStore } from '@nanostores/react'
import {
	getCoreRowModel,
	getExpandedRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	useReactTable,
	type ColumnFiltersState,
	type ColumnPinningState,
} from '@tanstack/react-table'
import { useEffect, useState } from 'react'

export function useTable() {
	const table = useStore(tableStore)
	const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
		left: [],
		right: [],
	})
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
	const [searchFilter, setSearchFilter] = useState<string>('')

	const { columns, data } = table
	const tableConfig = useReactTable({
		columns,
		data,
		getRowCanExpand: () => true,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getExpandedRowModel: getExpandedRowModel(),
		state: {
			columnPinning,
			globalFilter: searchFilter,
			columnFilters,
		},
		onColumnPinningChange: setColumnPinning,
		onGlobalFilterChange: setSearchFilter,
		onColumnFiltersChange: setColumnFilters,
		initialState: {
			pagination: {
				pageIndex: 0,
				pageSize: 5,
			},
			columnFilters: [
				{
					id: 'color',
					value: 'Negro',
				},
			],
		},
	})

	useEffect(() => {
		const columnsPinned = table.columnPinning
		if (columnsPinned) {
			setColumnPinning(columnsPinned)
		}

		tableStore.listen(({ searchFilter }) => {
			setSearchFilter(searchFilter ?? '')
		})
		tableStore.listen(({ columnFilters }) => {
			console.log(columnFilters)
			setColumnFilters(columnFilters ?? [])
		})
	}, [])

	return {
		tableConfig,
	}
}
