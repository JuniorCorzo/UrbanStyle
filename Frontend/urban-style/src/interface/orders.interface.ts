import type { Address } from './address.interface'
import type { ProductSummary } from './product.interface'

export enum ORDER_STATUS {
	PROCESSING = 'PROCESSING',
	SENT = 'SENT',
	DELIVERED = 'DELIVERED',
	CANCELED = 'CANCELED',
}

export enum PAYMENT_METHOD {
	CARD = 'CARD',
	EFFECTIVE = 'EFFECTIVE',
	PSE = 'PSE',
}

export type OrderStatus = keyof typeof ORDER_STATUS
export type PaymentMethod = keyof typeof PAYMENT_METHOD

export interface OrderEvent {
	status: OrderStatus
	date: string
}

export type OrderHistory = OrderEvent[]

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

export type Customer = {
	userId: string
	username: string
}

export interface OrderWithCustomer extends Omit<Order, 'userId'> {
	customer: Customer
}
export interface CreateOrder extends Pick<Order, 'userId' | 'address' | 'paymentMethod'> {}
