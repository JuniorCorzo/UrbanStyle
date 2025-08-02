import { dashboardStatsStore } from '@/state/report.store'
import { SummaryStat } from './SummaryStat'
import { useStore } from '@nanostores/react'

export function DashboardSummaryStats() {
	const dashboardStatsState = useStore(dashboardStatsStore)

	return (
		<div className="grid w-full grid-cols-[repeat(auto-fit,_max(9rem))] justify-between gap-5 md:grid-cols-[repeat(auto-fit,_max(12rem))]">
			{dashboardStatsState.map((props) => (
				<SummaryStat {...props} />
			))}
		</div>
	)
}
