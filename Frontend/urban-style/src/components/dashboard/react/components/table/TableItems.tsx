import { useTable } from '../../hooks/useTable'
import { Table } from './Table'

export function TableItems() {
	const { tableConfig } = useTable()
	return <Table tableConfig={tableConfig} />
}
