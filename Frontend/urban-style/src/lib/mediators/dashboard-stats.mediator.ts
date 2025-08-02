import type { SummaryStatProps } from '@/components/dashboard/react/components/stats/SummaryStat'
import { dashboardStatsStore, getReportPreviousMonth, reportSalesStore } from '@/state/report.store'

export function dashboardStats() {
	reportSalesStore.subscribe(() => {
		dashboardStatsStore.set(getDashboardStats())
	})
}

export function getDashboardStats() {
	const reportState = reportSalesStore.get()
	const salesLastMonth = getReportPreviousMonth()

	const stats: SummaryStatProps[] = [
		{
			label: 'Ingresos (Último mes)',
			value: Intl.NumberFormat('es-CO', {
				notation: 'compact',
				compactDisplay: 'short',
				maximumFractionDigits: 1,
			}).format(salesLastMonth?.total ?? 0),
			title: Intl.NumberFormat('es-CO', {
				style: 'currency',
				currency: 'COP',
				currencyDisplay: 'code',
			}).format(salesLastMonth?.total ?? 0),
		},
		{
			label: 'Ventas (Último mes)',
			value: salesLastMonth?.sales ?? 0,
			title: salesLastMonth?.sales ?? 0,
		},
		{
			label: 'AOV',
			value: Intl.NumberFormat('es-CO', {
				notation: 'compact',
				compactDisplay: 'short',
				maximumFractionDigits: 2,
			}).format(reportState?.aov ?? 0),
			title: `Valor promedio por pedido: ${reportState?.aov}`,
		},
		{
			label: 'Pedidos diarios',
			value: reportState?.dailyTransactionsAverage ?? 0,
			title: `Promedio de pedidos diarios: ${reportState?.dailyTransactionsAverage ?? 0}`,
		},
		{
			label: 'Pedidos Completados',
			value: reportState?.transactions ?? 0,
			title: `Total de pedidos completados: ${reportState?.transactions ?? 0}`,
		},
	]

	return stats
}
