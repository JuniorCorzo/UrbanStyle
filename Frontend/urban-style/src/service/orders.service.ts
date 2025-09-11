import { extractResponse, extractSingleResponse } from '@/adapter/responses.adapter'
import { PUBLIC_API_URL } from '@/config/env-config'
import type {
	CreateOrder,
	Customer,
	Order,
	OrderStatus,
	OrderWithCustomer,
} from '@/interface/orders.interface'
import type { ErrorMessage, Pagination, Response } from '@/interface/response.interface'
import { Err, type Result } from '@/lib/result_pattern'
import axios from 'axios'

async function getAllOrders(): Promise<Result<OrderWithCustomer[], ErrorMessage>> {
	const response = await axios.get<Response<OrderWithCustomer>>(
		`${PUBLIC_API_URL}/orders/with-customer`,
		{
			withCredentials: true,
		},
	)

	return extractResponse(response)
}

async function getAllCustomers(): Promise<Result<Customer[], ErrorMessage>> {
	const response = await axios.get<Response<Customer>>(`${PUBLIC_API_URL}/orders/customers`, {
		withCredentials: true,
	})

	return extractResponse(response)
}

async function getOrderByUserId(
	userId: string,
	token: string,
	page: number = 0,
): Promise<Result<Pagination<Order[]>, ErrorMessage>> {
	if (!userId) return Err('User id not found')

	const response = await axios.get<Response<Pagination<Order[]>>>(
		`${PUBLIC_API_URL}/orders/by?user-id=${userId}&page=${page}&size=10&sort=orderDate,desc`,
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
			validateStatus: () => true,
		},
	)
	console.log(response)
	return extractSingleResponse(response)
}

async function createOrder(createOrder: CreateOrder): Promise<Result<Order[], ErrorMessage>> {
	const response = await axios.post<Response<Order>>(
		`${PUBLIC_API_URL}/orders/create`,
		createOrder,
		{
			withCredentials: true,
		},
	)

	return extractResponse(response)
}

async function changeStatus(
	orderId: string,
	status: OrderStatus,
): Promise<Result<Order, ErrorMessage>> {
	const response = await axios.patch<Response<Order>>(
		`${PUBLIC_API_URL}/orders/change-status?id=${orderId}&status=${status}`,
		{},
		{
			withCredentials: true,
		},
	)

	return extractSingleResponse(response)
}

async function cancelOrder(orderId: string): Promise<Result<Order[], ErrorMessage>> {
	const response = await axios.patch<Response<Order>>(
		`${PUBLIC_API_URL}/orders/cancel-order?id=${orderId}`,
		{},
		{
			withCredentials: true,
		},
	)

	return extractResponse(response)
}

export const OrderService = {
	getAllOrders,
	getAllCustomers,
	getOrderByUserId,
	createOrder,
	changeStatus,
	cancelOrder,
}
