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
		<div className="flex flex-col gap-3 px-8">
			<TableFilters></TableFilters>
			<div className="border-border shadow-border border shadow-sm">
				<div className="overflow-auto">
					<Table tableConfig={tableConfig}></Table>
				</div>
				<TablePagination tableConfig={tableConfig}></TablePagination>
			</div>
			<FormDeleteModal />
		</div>
	)
}
