import { Table } from '@/components/dashboard/react/components/table/Table'
import { useUserAddress } from '../hooks/useUserAddress'
import { useTable } from '@/components/dashboard/react/hooks/useTable'
import { TableFilters } from '@/components/dashboard/react/components/table/TableFilters'
import { TablePagination } from '@/components/dashboard/react/components/table/TablePagination'
import FormDeleteModal from '@/components/dashboard/react/components/modals/FormDeleteModal'

export function UserAddress() {
	useUserAddress()
	const { tableConfig } = useTable()

	return (
		<div className="flex min-w-0 flex-col gap-3 overflow-auto px-5 md:px-11">
			<span className="text-lg font-medium tracking-wide">{'Direcciones'}</span>
			<TableFilters />
			<div className="border-border shadow-border min-w-0 overflow-auto border shadow-sm">
				<div className="overflow-x-auto">
					<Table tableConfig={tableConfig}></Table>
				</div>
				<TablePagination tableConfig={tableConfig}></TablePagination>
			</div>
			<FormDeleteModal />
		</div>
	)
}
