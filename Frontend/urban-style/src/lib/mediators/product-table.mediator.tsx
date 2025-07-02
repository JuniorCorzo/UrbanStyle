import type { Products } from '@/interface/product.interface'
import { createColumnHelper, type CellContext, type ColumnDef } from '@tanstack/react-table'
import { productStore, ProductStore } from '@/state/product.store'
import { ReportService } from '@/service/report.service'
import type { BestSeller } from '@/interface/report.interface'
import { tableMostSoldStore, tableStore } from '@/state/table.state'
import TableActions from '@/components/dashboard/react/TableActions'
import { Cell } from '@/components/dashboard/react/Cell'

export async function productTable(): Promise<void> {
	await ProductStore()

	const columnAccessor = createColumnHelper<Products>()
	const columns = [
		columnAccessor.accessor('name', {
			header: 'Nombre',
			size: 200,
			cell: (info) => <Cell.Span>{info.getValue()}</Cell.Span>,
		}),
		columnAccessor.accessor('description', {
			header: 'Descripción',
			size: 350,
			cell: (info) => <Cell.Description>{info.getValue()}</Cell.Description>,
		}),
		columnAccessor.accessor('price', {
			header: 'Precio',
			cell: (info) => <Cell.Span>{`${info.getValue().toLocaleString()} Pesos`}</Cell.Span>,
		}),
		columnAccessor.accessor('categories', {
			header: 'Categorías',
			cell: (info) => {
				const category = info.getValue()

				return (
					<Cell.List>
						{category.map(({ name }) => (
							<Cell.ListItem key={crypto.randomUUID()}>
								<Cell.Span>{name}</Cell.Span>
							</Cell.ListItem>
						))}
					</Cell.List>
				)
			},
		}),
		columnAccessor.accessor('stock', {
			header: 'Stock',
			cell: (info) => <Cell.Span>{`${info.getValue()} Unidades`}</Cell.Span>,
		}),
		columnAccessor.accessor('discount', {
			header: 'Descuento',
			cell: (info) => <Cell.Span>{`${info.getValue()} %`}</Cell.Span>,
		}),
		columnAccessor.group({
			header: 'Atributos',
			size: 400,
			columns: [
				columnAccessor.accessor('attributes.color', {
					header: 'Color',
					cell: (info) => {
						const attr = info.row.original.attributes
						return (
							<Cell.List>
								{attr.map(({ color }) => (
									<Cell.ListItem key={crypto.randomUUID()}>
										<Cell.Span>{color}</Cell.Span>
									</Cell.ListItem>
								))}
							</Cell.List>
						)
					},
				}),
				columnAccessor.accessor('attributes.size', {
					header: 'Talla',
					cell: (info: CellContext<Products, any>) => {
						const attr = info.row.original.attributes
						return (
							<Cell.List>
								{attr.map(({ size }) => (
									<Cell.ListItem key={crypto.randomUUID()}>
										<Cell.Span>{size}</Cell.Span>
									</Cell.ListItem>
								))}
							</Cell.List>
						)
					},
				}),
				columnAccessor.accessor('attributes.quantity', {
					header: 'Stock',
					cell: (info: CellContext<Products, any>) => {
						const attr = info.row.original.attributes
						return (
							<Cell.List className="grid min-h-full auto-rows-fr">
								{attr.map(({ quantity }) => (
									<Cell.ListItem
										className="not-last:border-b border-border h-full w-full p-4"
										key={crypto.randomUUID()}
									>
										<Cell.Span>{quantity}</Cell.Span>
									</Cell.ListItem>
								))}
							</Cell.List>
						)
					},
				}),
			],
		}),
		columnAccessor.display({
			header: 'Acciones',
			size: 100,
			cell: (info) => <TableActions id={info.row.original.id} />,
		}),
	]

	productStore.subscribe((products) => {
		console.log(products)
		tableStore.set({
			columns: columns as ColumnDef<unknown, any>[],
			data: [...products],
		})
	})

	await mostSoldTable()
}

async function mostSoldTable() {
	const columnAccessor = createColumnHelper<BestSeller>()
	const columns = [
		columnAccessor.accessor('name', {
			header: 'Producto',
		}),
		columnAccessor.accessor('sold', {
			header: 'Vendido',
		}),
	] as ColumnDef<unknown, any>[]

	tableMostSoldStore.set({
		columns,
		data: await ReportService().productsMoreSold(),
	})
}
