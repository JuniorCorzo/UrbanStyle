import { OrderFilterByStatus } from '@/components/orders/react/components/OrderFilterByStatus'
import { OrderDateFilter } from './OrderDateFilter'

export function OrderFilter() {
	return (
		<div className="flex flex-row flex-wrap gap-3 lg:flex-nowrap lg:items-center">
			<OrderFilterByStatus />
			<OrderDateFilter />
		</div>
	)
}
