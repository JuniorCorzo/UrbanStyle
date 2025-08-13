import { PUBLIC_API_URL } from '@/config/env-config'
import type {
	CreateOrder,
	Customer,
	Order,
	OrderStatus,
	OrderWithCustomer,
} from '@/interface/orders.interface'
import type { Response } from '@/interface/response.interface'
import axios from 'axios'

export class OrderService {
	static async getAllOrders(): Promise<OrderWithCustomer[]> {
		return (
			await axios
				.get<Response<OrderWithCustomer>>(`${PUBLIC_API_URL}/orders/with-customer`, {
					withCredentials: true,
				})
				.then((response) => {
					if (response.status !== 200) throw Error('unexpected error')
					return response.data
				})
		).data
	}

	static async getAllCustomers(): Promise<Customer[]> {
		return (
			await axios
				.get<Response<Customer>>(`${PUBLIC_API_URL}/orders/customers`, { withCredentials: true })
				.then((response) => {
					if (response.status !== 200) throw Error('unexpected error')
					return response.data
				})
		).data
	}

	static async getOrderByUserId(userId: string, token: string): Promise<Order[]> {
		if (!userId) {
			console.error('User id not found')
			return []
		}
		return (
			await axios
				.get<Response<Order>>(`${PUBLIC_API_URL}/orders/by?user-id=${userId}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
				.then((response) => {
					if (response.status !== 200) throw Error('Error sending request')
					return response.data
				})
		).data
	}

	static async createOrder(createOrder: CreateOrder): Promise<Order[]> {
		return (
			await axios
				.post<Response<Order>>(`${PUBLIC_API_URL}/orders/create`, createOrder, {
					withCredentials: true,
				})
				.then((response) => {
					if (response.status !== 200) throw Error('Response error')
					return response.data
				})
		).data
	}

	static async changeStatus(orderId: string, status: OrderStatus): Promise<Order> {
		return (
			await axios
				.patch<Response<Order>>(
					`${PUBLIC_API_URL}/orders/change-status?id=${orderId}&status=${status}`,
					{},
					{
						withCredentials: true,
					},
				)
				.then((response) => {
					if (response.status !== 200) throw Error('expected error')
					return response.data
				})
		).data[0]
	}

	static async cancelOrder(orderId: string): Promise<Order[]> {
		return (
			await axios
				.patch<Response<Order>>(
					`${PUBLIC_API_URL}/orders/cancel-order?id=${orderId}`,
					{},
					{
						withCredentials: true,
					},
				)
				.then((response) => {
					if (response.status !== 200) throw Error('Response error')
					return response.data
				})
		).data
	}
}
