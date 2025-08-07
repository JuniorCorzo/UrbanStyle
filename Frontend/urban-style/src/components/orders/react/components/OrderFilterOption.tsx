import { getOrderStatus } from '@/const/orders.const'
import type { OrderOptions } from './OrderFilterByStatus'
import { Tag } from '@/components/react/Tag'

interface OrderFilterOptionProps {
	status: OrderOptions
	selectedItem: OrderOptions
}

export function OrderFilterOption({ status, selectedItem }: OrderFilterOptionProps) {
	return (
		<Tag
			value={status}
			label={status === 'ALL' ? 'Todos' : getOrderStatus(status)?.status}
			selectedItem={selectedItem}
			data-status={status}
		/>
	)
}
