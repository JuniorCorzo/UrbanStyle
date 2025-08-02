import type { Category } from '@/interface/category.interface'
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table'
import { categoriesStore, CategoriesStore, categoryReportStore } from '@/state/categories.store'
import type { CategoryReport } from '@/interface/report.interface'
import { tableStore } from '@/state/table.state'
import TableActions from '@/components/dashboard/react/components/table/TableActions'
import { Cell } from '@/components/dashboard/react/components/table/Cell'
import { ModeSelector } from '@/components/dashboard/react/components/ModeSelector'

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
			hasForm: true,
			filterComponents: { right: () => <ModeSelector /> },
		})
	})
}

export async function categoryReportTable() {
	const columnAccessor = createColumnHelper<CategoryReport>()
	const columns = [
		columnAccessor.accessor('name', {
			header: 'Categoría',
			cell: ({ getValue }) => <Cell.Span>{getValue()}</Cell.Span>,
		}),
		columnAccessor.group({
			header: 'Mensual',
			columns: [
				columnAccessor.accessor('monthly.income', {
					header: 'ingresos',
					cell: (row) => (
						<Cell.Span>
							{Intl.NumberFormat('es-CO', {
								style: 'currency',
								currency: 'COP',
								currencyDisplay: 'code',
							}).format(row.getValue())}
						</Cell.Span>
					),
				}),
				columnAccessor.accessor('monthly.unitsSold', {
					header: 'vendido',
					cell: (row) => (
						<Cell.Span>
							{Intl.NumberFormat('es-CO', {
								maximumFractionDigits: 2,
							}).format(row.getValue())}
						</Cell.Span>
					),
				}),
			],
		}),
		columnAccessor.group({
			header: 'Total',
			columns: [
				columnAccessor.accessor('total.income', {
					header: 'ingresos',
					cell: (row) => (
						<Cell.Span>
							{Intl.NumberFormat('es-CO', {
								style: 'currency',
								currency: 'COP',
								currencyDisplay: 'code',
							}).format(row.getValue())}
						</Cell.Span>
					),
				}),
				columnAccessor.accessor('total.unitsSold', {
					header: 'vendido',
					cell: (row) => (
						<Cell.Span>
							{Intl.NumberFormat('es-CO', {
								maximumFractionDigits: 2,
							}).format(row.getValue())}
						</Cell.Span>
					),
				}),
			],
		}),
	]

	categoryReportStore.subscribe((categoryReport) => {
		tableStore.set({
			columns: columns as ColumnDef<unknown, any>[],
			data: [...categoryReport],
			canSearch: true,
			hasForm: true,
			filterComponents: { right: () => <ModeSelector /> },
		})
	})
}
