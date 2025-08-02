import { dashboardStatsStore } from '@/state/report.store'
import { SummaryStat } from './SummaryStat'
import { useStore } from '@nanostores/react'

type DashboardSummaryStatsProps = {
	accessToken: string
}

export function DashboardSummaryStats() {
	const dashboardStatsState = useStore(dashboardStatsStore)

	return (
		<div className="col-span-full grid grid-cols-2 gap-5 md:grid-cols-3">
			{dashboardStatsState.map((props) => (
				<SummaryStat {...props} />
			))}
		</div>
	)
}
