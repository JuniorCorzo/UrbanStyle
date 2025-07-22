import type { Customer, OrderWithCustomer } from '@/interface/orders.interface'
import { OrderService } from '@/service/orders.service'
import { atom, onMount } from 'nanostores'

export const orderStore = atom<OrderWithCustomer[]>([])
onMount(orderStore, () => {
	OrderService.getAllOrders().then((order) => orderStore.set(order))
})

export const customerStore = atom<Customer[]>([])
onMount(orderStore, () => {
	OrderService.getAllCustomers().then((customers) => customerStore.set(customers))
})
