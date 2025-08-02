import { Cell } from '@/components/dashboard/react/components/table/Cell'
import { OrderSubComponent } from '@/components/orders/react/components/OrderSubComponent'
import { getOrderStatus, getPaymentMethod } from '@/const/orders.const'
import type { OrderWithCustomer } from '@/interface/orders.interface'
import type { SubComponent } from '@/interface/table-mediator.interface'
import { tableStore } from '@/state/table.state'
import { ChevronUpIcon, ChevronDownIcon, CreditCardIcon } from '@heroicons/react/24/outline'
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table'
import { cn } from '../cn'
import { OrderFilter } from '@/components/dashboard/react/components/table/filters/OrderFilter'
import { OrderFilterDropdown } from '@/components/dashboard/react/components/table/filters/OrderFilterDropdown'
import { orderStore } from '@/state/order.state'
import { OrderActions } from '@/components/dashboard/react/components/table/OrderActions'

export async function orderTable() {
	const columnHelper = createColumnHelper<OrderWithCustomer>()
	const columns = [
		columnHelper.display({
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
		}),
		columnHelper.accessor('customer.username', {
			id: 'customer.username',
			header: 'Cliente',
			cell: ({ getValue }) => <Cell.Span>{getValue()}</Cell.Span>,
		}),
		columnHelper.accessor('status', {
			header: 'Estado',
			cell: ({ getValue }) => {
				const status = getValue()
				return (
					<Cell.Tag
						className={cn(
							status === 'PROCESSING' && 'bg-yellow/90 text-yellow-2 shadow-yellow',
							status === 'SENT' && 'bg-green-1/90 text-green-2 shadow-green-1',
							status === 'CANCELED' && 'bg-red/70 text-red-2 shadow-red',
							status === 'DELIVERED' && 'bg-blue-1/90 text-blue-2 shadow-blue-1',
						)}
					>
						{getOrderStatus(getValue())?.status}
					</Cell.Tag>
				)
			},
		}),
		columnHelper.accessor('orderDate', {
			header: 'Fecha',
			cell: ({ getValue }) => (
				<Cell.Span>
					{new Intl.DateTimeFormat('es-CO', {
						dateStyle: 'long',
					}).format(new Date(getValue()))}
				</Cell.Span>
			),
			filterFn: ({ getValue }, columnId, filterValue) => {
				if (!(typeof filterValue === 'string') || filterValue === '') return true

				const dateValue = filterValue.split('/')

				const orderDate = new Date(getValue<string>(columnId))
				const initialDate = new Date(`${dateValue[0]}T00:00:00`)
				const lastDate = new Date(`${dateValue[1]}T00:00:00`)
				return orderDate >= initialDate && orderDate <= lastDate
			},
		}),
		columnHelper.accessor('products', {
			header: 'Items',
			cell: ({ getValue }) => <Cell.Span>{getValue().length}</Cell.Span>,
		}),
		columnHelper.accessor('total', {
			header: 'Monto Total',
			cell: ({ getValue }) => (
				<Cell.Span>
					{new Intl.NumberFormat('es-CO', {
						style: 'currency',
						currency: 'COP',
					}).format(getValue())}
				</Cell.Span>
			),
		}),
		columnHelper.accessor('paymentMethod', {
			header: 'Pago',
			cell: ({ getValue }) => (
				<Cell.Span>
					<Cell.Tag className="bg-accent flex w-fit items-center justify-center gap-2">
						<CreditCardIcon className="size-5" />
						{getPaymentMethod(getValue())}
					</Cell.Tag>
				</Cell.Span>
			),
		}),
		columnHelper.display({
			header: 'Acciones',
			cell: ({ row }) => (
				<Cell.Span className="pointer-events-none">
					<OrderActions orderId={row.original.id} status={row.original.status} />
				</Cell.Span>
			),
		}),
	] as ColumnDef<unknown, any>[]

	const orderSubComponent: SubComponent<OrderWithCustomer> = ({ row }) => (
		<OrderSubComponent row={row} />
	)

	orderStore.subscribe((orders) => {
		tableStore.set({
			columns,
			data: [...(orders ?? [])],
			subComponent: orderSubComponent as SubComponent<unknown>,
			filterComponents: {
				right: () => <OrderFilter />,
				left: () => <OrderFilterDropdown />,
			},
		})
	})
}
