import FormDeleteModal from '@/components/dashboard/react/components/modals/FormDeleteModal'
import { TableItems } from '@/components/dashboard/react/components/table/TableItems'
import { TableFilters } from './TableFilters'
import { useStore } from '@nanostores/react'
import { tableStore } from '@/state/table.state'

const DashboardTableSection = () => {
	const { titleSection } = useStore(tableStore)
	return (
		<article className="border-border shadow-border flex h-full w-full flex-col items-center gap-3 rounded border px-5 py-2 shadow-sm">
			<h2 className="w-full text-left text-2xl font-medium">{titleSection}</h2>
			<div className="flex w-full items-center justify-end gap-2">
				<TableFilters />
			</div>
			<TableItems />
			<FormDeleteModal />
		</article>
	)
}

export default DashboardTableSection
