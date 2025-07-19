import { OrderFilterByStatus } from '@/components/orders/react/components/OrderFilterByStatus'
import { OrderDateFilter } from './OrderDateFilter'

export function OrderFilter() {
	return (
		<div className="flex flex-col items-center gap-3 sm:flex-row">
			<OrderFilterByStatus />
			<OrderDateFilter />
		</div>
	)
}
