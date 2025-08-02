import type { CategorySummary } from './category.interface'

type SaleInfo = {
	unitsSold: number
	income: number
}

type ReportBase = {
	name: string
	total: SaleInfo[]
	monthly: SaleInfo[]
}

export type CategoryReport = ReportBase & {
	categoryId: string
}

export type ProductReport = ReportBase & {
	productId: string
	categories: CategorySummary[]
}

export type OrderReport = {
	startedOrders: number
	canceledOrders: number
	cancellationRate: number
}

export interface SalesData {
	date: string
	sales: number
	total: number
}

export type ReportSales = {
	day: SalesData[]
	month: SalesData[]
	aov: number
	dailyTransactionsAverage: number
	transactions: number
}
