import type { Products } from '@/interface/product.interface'
import {
	createColumnHelper,
	type CellContext,
	type ColumnDef,
	type Row,
} from '@tanstack/react-table'
import { productStore, ProductStore } from '@/state/product.store'
import { ReportService } from '@/service/report.service'
import type { BestSeller } from '@/interface/report.interface'
import { tableMostSoldStore, tableStore } from '@/state/table.state'
import TableActions from '@/components/dashboard/react/components/table/TableActions'
import { Cell } from '@/components/dashboard/react/components/table/Cell'
import type { CategorySummary } from '@/interface/category.interface'
import { FiltersDropdown } from '@/components/dashboard/react/components/table/filters/FiltersDropdown'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'
import { ProductSubComponent } from '@/components/dashboard/react/components/table/ProductSubComponent'
import type { SubComponent } from '@/interface/table-mediator.interface'
import { ProductFilter } from '@/components/dashboard/react/components/table/filters/ProductFilter'

export async function productTable(): Promise<void> {
	await ProductStore()

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
			filterComponents: { left: () => <ProductFilter /> },
			canExpand: true,
			subComponent: productSubComponent as SubComponent<unknown>,
			canSearch: true,
			hasForm: true,
		})
	})

	await mostSoldTable()
}

async function mostSoldTable() {
	const columnAccessor = createColumnHelper<BestSeller>()
	const columns = [
		columnAccessor.accessor('name', {
			header: 'Producto',
			cell: ({ getValue }) => <Cell.Span>{getValue()}</Cell.Span>,
		}),
		columnAccessor.accessor('sold', {
			header: 'Vendido',
			cell: ({ getValue }) => <Cell.Span>{getValue()}</Cell.Span>,
		}),
	] as ColumnDef<unknown, any>[]

	tableMostSoldStore.set({
		columns,
		data: await ReportService().productsMoreSold(),
	})
}
