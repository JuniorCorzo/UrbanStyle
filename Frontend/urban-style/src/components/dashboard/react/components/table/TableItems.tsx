import { useTable } from '../../hooks/useTable'
import { Table } from './Table'
import { TablePagination } from './TablePagination'

export function TableItems() {
	const { tableConfig } = useTable()
	return (
		<div className="border-border w-full border">
			<div className="border-border w-full overflow-x-auto">
				<Table tableConfig={tableConfig} />
			</div>
			<TablePagination tableConfig={tableConfig} />
		</div>
	)
}
