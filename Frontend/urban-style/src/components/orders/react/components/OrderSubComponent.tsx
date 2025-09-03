import type { OrderWithCustomer } from '@/interface/orders.interface'
import type { SubComponentProps } from '@/interface/table-mediator.interface'
import { OrderProductItem } from './OrderProductItem'
import { OrderAddress } from './OrderAddress'
import { OrderHistory } from './OrderHistory'

export function OrderSubComponent({ row }: SubComponentProps<OrderWithCustomer>) {
	const { address, history, products } = row.original
	return (
		<div className="grid grid-cols-2 gap-3 p-5">
			<div className="border-border bg-background flex w-full flex-col gap-3 rounded-md border p-3">
				<span className="text-center text-lg font-medium uppercase tracking-wide">Productos</span>
				{products.map((product) => (
					<OrderProductItem product={product} />
				))}
			</div>
			<div className="bg-background border-border flex h-fit justify-between rounded-md border p-3">
				<div className="flex flex-col gap-3">
					<span className="text-center text-lg font-medium uppercase tracking-wide">
						<h2>Dirección de entrega</h2>
					</span>
					<OrderAddress address={address} />
				</div>
				<div className="flex flex-col gap-3">
					<span className="text-center text-lg font-medium uppercase tracking-wide">
						<h2>Historial de Cambios</h2>
					</span>
					{history.map((orderEvent) => (
						<OrderHistory orderHistory={orderEvent} />
					))}
				</div>
			</div>
		</div>
	)
}
