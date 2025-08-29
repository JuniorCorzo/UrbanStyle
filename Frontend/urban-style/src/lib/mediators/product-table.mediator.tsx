import type { Products } from '@/interface/product.interface'
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table'
import { productReportStore, productStore, ProductStore } from '@/state/product.store'
import { tableStore } from '@/state/table.state'
import TableActions from '@/components/dashboard/react/components/table/TableActions'
import { Cell } from '@/components/dashboard/react/components/table/Cell'
import type { CategorySummary } from '@/interface/category.interface'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'
import { ProductSubComponent } from '@/components/dashboard/react/components/table/ProductSubComponent'
import type { SubComponent } from '@/interface/table-mediator.interface'
import { ProductFilter } from '@/components/dashboard/react/components/table/filters/ProductFilterDropdown'
import type { ProductReport } from '@/interface/report.interface'
import { ModeSelector } from '@/components/dashboard/react/components/ModeSelector'

export async function productTable(): Promise<void> {
	const columnAccessor = createColumnHelper<Products>()
	const columns = [
		columnAccessor.display({
			id: 'expanded',
			header: undefined,
			maxSize: 50,
			cell: ({ row }) => {
				return row.getCanExpand() ? (
					<Cell.Span>
						{row.getIsExpanded() ? (
							<ChevronUpIcon className="size-5" />
						) : (
							<ChevronDownIcon className="size-5" />
						)}
					</Cell.Span>
				) : null
			},
			enablePinning: true,
		}),
		columnAccessor.accessor('name', {
			header: 'Nombre',
			size: 200,
			cell: (info) => <Cell.Span className="gap-3">{info.getValue()}</Cell.Span>,
			enablePinning: true,
		}),
		columnAccessor.accessor('categories', {
			header: 'Categorías',
			cell: (info) => {
				const category = info.getValue()

				return (
					<Cell.TagsContainer>
						{category.map(({ name }) => (
							<Cell.Tag key={crypto.randomUUID()}>{name}</Cell.Tag>
						))}
					</Cell.TagsContainer>
				)
			},
			filterFn: (row, columnId, filterValue: string[]) => {
				const categories = row.getValue<CategorySummary[]>(columnId)
				return filterValue.length === 0
					? true
					: categories.some(({ name }) => filterValue.includes(name))
			},
		}),
		columnAccessor.accessor('price', {
			header: 'Precio',
			cell: (info) => <Cell.Span>{`${info.getValue().toLocaleString()} Pesos`}</Cell.Span>,
		}),
		columnAccessor.accessor('discount', {
			header: 'Descuento',
			cell: (info) => <Cell.Span>{`${info.getValue()} %`}</Cell.Span>,
		}),
		columnAccessor.accessor('stock', {
			header: 'Stock',
			cell: (info) => <Cell.Span>{`${info.getValue()} Unidades`}</Cell.Span>,
		}),
		columnAccessor.display({
			header: 'Acciones',
			size: 100,
			cell: (info) => <TableActions id={info.row.original.id} />,
		}),
	]

	const productSubComponent: SubComponent<Products> = ({ row }) => {
		return <ProductSubComponent row={row} />
	}

	productStore.subscribe((products) => {
		tableStore.set({
			columns: columns as ColumnDef<unknown, any>[],
			data: [...products],
			columnPinning: { left: ['expanded', 'name'] },
			columnFilters: [],
			filterComponents: {
				left: () => <ProductFilter />,
				right: () => <ModeSelector />,
			},
			canExpand: true,
			subComponent: productSubComponent as SubComponent<unknown>,
			canSearch: true,
			hasForm: true,
		})
	})
}

export async function productReportTable() {
	const columnAccessor = createColumnHelper<ProductReport>()
	const columns = [
		columnAccessor.accessor('name', {
			header: 'Producto',
			cell: ({ getValue }) => <Cell.Span>{getValue()}</Cell.Span>,
		}),
		columnAccessor.accessor('categories', {
			header: 'Categorías',
			minSize: 150,
			cell: (info) => {
				const category = info.getValue()

				return (
					<Cell.TagsContainer>
						{category.map(({ name }) => (
							<Cell.Tag key={crypto.randomUUID()}>{name}</Cell.Tag>
						))}
					</Cell.TagsContainer>
				)
			},
			filterFn: (row, columnId, filterValue: string[]) => {
				const categories = row.getValue<CategorySummary[]>(columnId)
				return filterValue.length === 0
					? true
					: categories.some(({ name }) => filterValue.includes(name))
			},
		}),
		columnAccessor.group({
			header: 'Mensual',
			minSize: 300,
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
			minSize: 300,
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

	productReportStore.subscribe((productReport) => {
		tableStore.set({
			columns: columns as ColumnDef<unknown, any>[],
			data: [...productReport],
			columnFilters: [],
			filterComponents: { left: () => <ProductFilter />, right: () => <ModeSelector /> },
			canExpand: true,
			canSearch: true,
			hasForm: true,
		})
	})
}
