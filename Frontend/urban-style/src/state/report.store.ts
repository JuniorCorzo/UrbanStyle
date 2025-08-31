import type { SummaryStatProps } from '@/components/dashboard/react/components/stats/SummaryStat'
import { ResponseException } from '@/exceptions/response.exception'
import type { ReportSales } from '@/interface/report.interface'
import { ReportService } from '@/service/report.service'
import { atom, computed, onMount } from 'nanostores'

export const reportSalesStore = atom<ReportSales | null>(null)
export const dashboardStatsStore = atom<SummaryStatProps[]>([])

onMount(reportSalesStore, () => {
	ReportService.reportSales().then((response) => {
		if (!response.success) throw new ResponseException(response.error)
		reportSalesStore.set(response.data)
	})
})

export const getReportPreviousMonth = () =>
	computed(reportSalesStore, (report) => {
		if (!report) return

		const dateNow = new Date()
		const monthPrevious = Intl.DateTimeFormat('en', {
			month: '2-digit',
			year: 'numeric',
		})
			.format(dateNow.setMonth(dateNow.getMonth() - 1))
			.replace('/', '-')

		const index = report.month.findLastIndex(({ date }) => date === monthPrevious)
		console.log(index)
		return report.month[index]
	}).get()
