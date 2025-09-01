import { ArrowPathRoundedSquareIcon } from '@heroicons/react/24/outline'
import { OrderActionModal, type OrderActionModalRef } from './OrderActionModal'
import { useRef } from 'react'
import { ORDER_STATUS, type OrderStatus } from '@/interface/orders.interface'

type OrderActionsProps = {
	orderId: string
	status: OrderStatus
}

export function OrderActions({ orderId, status }: OrderActionsProps) {
	const orderModalRef = useRef<OrderActionModalRef>(null)
	const handleClick = () => orderModalRef.current?.open()

	return (
		<button
			className="pointer-events-auto cursor-pointer"
			title="Cambiar estado de orden"
			onClick={handleClick}
			aria-haspopup="dialog"
			aria-controls={orderId}
		>
			<ArrowPathRoundedSquareIcon className="pointer-events-none size-6" />
			<OrderActionModal orderId={orderId} status={status} ref={orderModalRef} />
		</button>
	)
}
