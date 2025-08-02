import type { Customer, OrderWithCustomer } from '@/interface/orders.interface'
import type { OrderReport } from '@/interface/report.interface'
import { OrderService } from '@/service/orders.service'
import { ReportService } from '@/service/report.service'
import { atom, computed, onMount } from 'nanostores'
import { dashboardStatsStore } from './report.store'
import { getDashboardStats } from '@/lib/mediators/dashboard-stats.mediator'

export const orderStore = atom<OrderWithCustomer[]>([])
onMount(orderStore, () => {
	OrderService.getAllOrders().then((order) => orderStore.set(order))
})

export const orderReportStore = atom<OrderReport | undefined>()
onMount(orderReportStore, () => {
	ReportService()
		.orderReport()
		.then((report) => orderReportStore.set(report))
})

export const setOrderStats = () =>
	computed(orderReportStore, (orderReport) => {
		dashboardStatsStore.set([
			...getDashboardStats(),
			{
				label: 'Pedidos Iniciados',
				value: orderReport?.startedOrders ?? 0,
			},
			{
				label: 'Pedidos cancelados',
				value: orderReport?.canceledOrders ?? 0,
			},
			{
				label: 'Taza de cancelación',
				value: orderReport?.cancellationRate ?? 0,
			},
		])
	})

export const customerStore = atom<Customer[]>([])
onMount(orderStore, () => {
	OrderService.getAllCustomers().then((customers) => customerStore.set(customers))
})
