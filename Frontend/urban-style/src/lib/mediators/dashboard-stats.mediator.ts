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
			value: reportState?.aov ?? 0,
			title: `AOV: ${reportState?.aov}`,
		},
		{
			label: 'Pedidos diarios promedio',
			value: reportState?.dailyTransactionsAverage ?? 0,
		},
		{
			label: 'Pedidos',
			value: reportState?.transactions ?? 0,
		},
	]

	return stats
}
