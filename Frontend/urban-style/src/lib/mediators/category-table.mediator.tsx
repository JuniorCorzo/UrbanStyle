import type { Category } from '@/interface/category.interface'
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table'
import { categoriesStore, CategoriesStore } from '@/state/categories.store'
import type { BestSeller } from '@/interface/report.interface'
import { tableMostSoldStore, tableStore } from '@/state/table.state'
import { ReportService } from '@/service/report.service'
import TableActions from '@/components/dashboard/react/components/table/TableActions'
import { Cell } from '@/components/dashboard/react/components/table/Cell'

export async function categoriesTable(): Promise<void> {
	await CategoriesStore()

	const columnAccessor = createColumnHelper<Category>()
	const columns = [
		columnAccessor.accessor('name', {
			header: 'Nombre',
			size: 100,
			cell: (info) => <Cell.Span>{info.getValue()}</Cell.Span>,
		}),
		columnAccessor.accessor('description', {
			header: 'Descripción',
			cell: (info) => <Cell.Paragraph>{info.getValue()}</Cell.Paragraph>,
		}),
		columnAccessor.display({
			header: 'Acciones',
			size: 50,
			cell: (info) => <TableActions id={info.row.original.id} />,
		}),
	] as ColumnDef<unknown, any>[]

	categoriesStore.subscribe((category) => {
		tableStore.set({
			columns,
			data: [...category],
			canSearch: true,
		})
	})

	await categoriesMoreSold()
}

async function categoriesMoreSold() {
	const columnAccessor = createColumnHelper<BestSeller>()
	const columns = [
		columnAccessor.accessor('name', {
			header: 'Categoría',
			cell: ({ getValue }) => <Cell.Span>{getValue()}</Cell.Span>,
		}),
		columnAccessor.accessor('sold', {
			header: 'Vendido',
			cell: ({ getValue }) => <Cell.Span>{getValue()}</Cell.Span>,
		}),
	] as ColumnDef<unknown, any>[]

	tableMostSoldStore.set({
		columns,
		data: await ReportService().categoriesMoreSold(),
	})
}
