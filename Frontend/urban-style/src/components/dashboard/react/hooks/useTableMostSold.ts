import { tableMostSoldStore } from '@/state/table.state'
import { useStore } from '@nanostores/react'
import { useReactTable, getCoreRowModel } from '@tanstack/react-table'

export function useTableMostSold() {
	const { columns, data } = useStore(tableMostSoldStore)
	const tableConfig = useReactTable({
		columns,
		data,
		getCoreRowModel: getCoreRowModel(),
	})

	return {
		tableConfig,
	}
}
