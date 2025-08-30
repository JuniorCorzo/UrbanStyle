import type { Customer, OrderWithCustomer } from '@/interface/orders.interface'
import type { OrderReport } from '@/interface/report.interface'
import { OrderService } from '@/service/orders.service'
import { ReportService } from '@/service/report.service'
import { atom, computed, onMount } from 'nanostores'
import { dashboardStatsStore } from './report.store'
import { getDashboardStats } from '@/lib/mediators/dashboard-stats.mediator'

export const orderStore = atom<OrderWithCustomer[]>([])
onMount(orderStore, () => {
	OrderService.getAllOrders().then((response) => {
		if (!response.success) throw new Error(response.error.toString())
		orderStore.set(response.data)
	})
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
				label: 'Iniciados',
				value: orderReport?.startedOrders ?? 0,
				title: `Pedidos iniciados: ${orderReport?.startedOrders ?? 0}`,
			},
			{
				label: 'Cancelados',
				value: orderReport?.canceledOrders ?? 0,
				title: `Pedidos cancelados: ${orderReport?.canceledOrders ?? 0}`,
			},
			{
				label: 'Cancelación (%)',
				value: Intl.NumberFormat('es-CO', {
					style: 'unit',
					unit: 'percent',
					unitDisplay: 'short',
				}).format(orderReport?.cancellationRate ?? 0),
				title: `Taza de cancelaciones: ${orderReport?.cancellationRate ?? 0}`,
			},
		])
	})

export const customerStore = atom<Customer[]>([])
onMount(orderStore, () => {
	OrderService.getAllCustomers().then((response) => {
		if (!response.success) throw new Error(response.error.toString())
		customerStore.set(response.data)
	})
})
