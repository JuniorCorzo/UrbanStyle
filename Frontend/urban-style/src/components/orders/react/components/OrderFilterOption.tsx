import { getOrderStatus } from '@/const/orders.const'
import type { OrderOptions } from './OrderFilterByStatus'
import { cn } from '@/lib/cn'

interface OrderFilterOptionProps {
	status: OrderOptions
	selectedItem: OrderOptions
}

export function OrderFilterOption({ status, selectedItem }: OrderFilterOptionProps) {
	return (
		<span
			className={cn(
				'bg-foreground border-border shadow-border cursor-pointer rounded-lg border px-2 py-0.5 text-sm transition-all',
				status === selectedItem ? 'bg-accent custom-ring' : 'shadow-inner',
			)}
			data-status={status}
			aria-selected={status === selectedItem}
		>
			{status === 'ALL' ? 'Todos' : getOrderStatus(status)?.status}
		</span>
	)
}
