import { Cell } from '@/components/dashboard/react/components/table/Cell'
import { Steps } from '@/components/react/Steps'
import { getOrderStatus } from '@/const/orders.const'
import type { OrderEvent, OrderHistory } from '@/interface/orders.interface'
import { cn } from '@/lib/cn'

interface OrderHistoryProps {
	orderHistory: OrderEvent
}

export function OrderHistory({ orderHistory }: OrderHistoryProps) {
	const { date, status } = orderHistory
	return (
		<Steps className="flex-row-reverse" position="right">
			<Cell.Tag
				className={cn(
					'flex w-40 flex-col justify-center px-1.5 py-1 text-center leading-4 shadow',
					status === 'PROCESSING' && 'bg-yellow/90 text-yellow-2 shadow-yellow',
					status === 'SENT' && 'bg-green-1/90 text-green-2 shadow-green-1',
					status === 'CANCELED' && 'bg-red/70 text-red-2 shadow-red',
					status === 'DELIVERED' && 'bg-blue-1/90 text-blue-2 shadow-blue-1',
				)}
			>
				<span className="text-base font-medium">{`${getOrderStatus(status)?.status}`}</span>
				<span className="text-xs">{new Date(date).toLocaleDateString()}</span>
			</Cell.Tag>
		</Steps>
	)
}
