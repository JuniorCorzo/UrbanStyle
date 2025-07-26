import { cn } from '@/lib/cn'
import { useTableMostSold } from '../../hooks/useTableMostSold'
import { Table } from './Table'

export default function TableMostSold() {
	const { tableConfig } = useTableMostSold()
	return (
		<div className={cn('flex', tableConfig.getRowCount() > 4 && 'h-full items-center')}>
			<Table tableConfig={tableConfig} />
		</div>
	)
}
