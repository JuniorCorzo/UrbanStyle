import type { Address } from './address.interface'
import type { ProductSummary } from './product.interface'

export type OrderStatus = 'PROCESSING' | 'SENT' | 'DELIVERED' | 'CANCELED'
export type PaymentMethod = 'CARD' | 'EFFECTIVE' | 'PSE'

export interface OrderEvent {
	status: OrderStatus
	date: string
	description: string
}

export interface OrderHistory {
	events: OrderEvent[]
}

export interface Order {
	id: string
	userId: string
	products: ProductSummary[]
	total: number
	status: OrderStatus
	address: Address
	paymentMethod: PaymentMethod
	orderDate: string
	history: OrderHistory
}

export interface CreateOrder extends Pick<Order, 'userId' | 'address' | 'paymentMethod'> {}
