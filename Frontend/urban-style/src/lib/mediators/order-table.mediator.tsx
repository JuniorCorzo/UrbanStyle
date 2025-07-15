import { Cell } from '@/components/dashboard/react/components/table/Cell'
import { OrderSubComponent } from '@/components/orders/react/components/OrderSubComponent'
import { getOrderStatus } from '@/const/orders.const'
import type { Order } from '@/interface/orders.interface'
import type { SubComponent } from '@/interface/table-mediator.interface'
import { OrderService } from '@/service/orders.service'
import { UserService } from '@/service/user.service'
import { tableStore } from '@/state/table.state'
import { ChevronUpIcon, ChevronDownIcon, CreditCardIcon } from '@heroicons/react/24/outline'
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table'
import { useEffect, useState } from 'react'
import { cn } from '../cn'

const getUsernameById = (userId: string) => UserService.getUserById(userId).then(({ name }) => name)

export async function orderTable() {
	const orders = await OrderService.getAllOrders()

	const columnHelper = createColumnHelper<Order>()
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
		columnHelper.accessor('userId', {
			header: 'Usuario',
			cell: ({ getValue }) => {
				const [name, setName] = useState<string>()

				useEffect(() => {
					getUsernameById(getValue()).then(setName)
				}, [getValue()])
				return <Cell.Span>{name}</Cell.Span>
			},
		}),
		columnHelper.accessor('products', {
			header: 'N° Items',
			cell: ({ getValue }) => <Cell.Span>{getValue().length}</Cell.Span>,
		}),
		columnHelper.accessor('orderDate', {
			header: 'Fecha de orden',
			cell: ({ getValue }) => <Cell.Span>{new Date(getValue()).toLocaleDateString()}</Cell.Span>,
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
		columnHelper.accessor('total', {
			header: 'Total',
			cell: ({ getValue }) => <Cell.Span>{getValue().toLocaleString()}</Cell.Span>,
		}),
		columnHelper.accessor('paymentMethod', {
			header: 'Método de pago',
			cell: ({ getValue }) => (
				<Cell.Span>
					<Cell.Tag className="bg-accent flex w-fit items-center justify-center gap-2">
						<CreditCardIcon className="size-5" />
						{getValue()}
					</Cell.Tag>
				</Cell.Span>
			),
		}),
	] as ColumnDef<unknown, any>[]

	const orderSubComponent: SubComponent<Order> = ({ row }) => <OrderSubComponent row={row} />

	tableStore.set({
		columns,
		data: orders,
		subComponent: orderSubComponent as SubComponent<unknown>,
	})
}
