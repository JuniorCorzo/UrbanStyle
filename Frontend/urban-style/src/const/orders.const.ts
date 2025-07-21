import type { OrderStatus, PaymentMethod } from '@/interface/orders.interface'

type OrderMeta = {
	status: string
	color: string
}

export function getOrderStatus(status: OrderStatus) {
	const statusMap = new Map<OrderStatus, OrderMeta>([
		['DELIVERED', { status: 'Entregado', color: 'green' }],
		['CANCELED', { status: 'Cancelado', color: 'bg-red' }],
		['PROCESSING', { status: 'Procesando', color: 'rgba(var(--color-yellow), 0.8)' }],
		['SENT', { status: 'Enviado', color: 'bg-blue' }],
	])

	return statusMap.get(status)
}

export function getPaymentMethod(paymentMethod: PaymentMethod) {
	const paymentMap = new Map<PaymentMethod, string>([
		['CARD', 'Tarjeta'],
		['EFFECTIVE', 'Efectivo'],
		['PSE', 'PSE'],
	])

	return paymentMap.get(paymentMethod)
}
