import { useEffect, useRef, useState } from 'react'
import { ColorType, createChart, LineSeries } from 'lightweight-charts'
import { convertToIso } from '@/lib/utils/convert-date'
import { SelectInput } from '../../../react/inputs/SelectInput'
import type { SelectOptions } from '@/interface/form-mediator.interface'
import { useStore } from '@nanostores/react'
import { reportSalesStore } from '@/state/report.store'
import type { ReportSales } from '@/interface/report.interface'

type TimeType = keyof Pick<ReportSales, 'day' | 'month'>

export default function ChartComponent() {
	const reportData = useStore(reportSalesStore)
	const $containerChartRef = useRef<HTMLDivElement>(null)
	const [timeType, setTimeType] = useState<TimeType>('day')

	const colors = {
		backgroundColor: '#eff1f5',
		lineColor: '#7c7f93',
		textColor: '#4c4f69',
	}

	useEffect(() => {
		if (!$containerChartRef.current) return

		const handleResize = () => {
			chart.applyOptions({ width: $containerChartRef.current?.clientWidth })
		}

		const chart = createChart($containerChartRef?.current, {
			layout: {
				background: {
					type: ColorType.Solid,
					color: colors.backgroundColor,
				},
				textColor: colors.textColor,
				attributionLogo: false,
			},
			width: $containerChartRef.current.clientWidth,
			height: 300,
		})

		chart.applyOptions({
			crosshair: {
				horzLine: {
					labelBackgroundColor: colors.lineColor,
				},
				vertLine: {
					labelBackgroundColor: colors.lineColor,
				},
			},
			handleScroll: {
				mouseWheel: true,
			},
			handleScale: {
				mouseWheel: false,
			},
		})

		chart.timeScale().fitContent()
		chart.timeScale().applyOptions({
			borderColor: colors.lineColor,
		})

		const lineSeries = chart.addSeries(LineSeries, {
			color: colors.lineColor,
		})

		lineSeries.priceScale().applyOptions({
			borderColor: colors.lineColor,
		})

		reportData &&
			lineSeries.setData(
				reportData[timeType]?.map(({ date, sales }) => {
					return {
						time: convertToIso(date),
						value: sales,
					}
				}),
			)

		window.addEventListener('resize', handleResize)
		return () => {
			window.removeEventListener('resize', handleResize)
			chart.remove()
		}
	}, [reportData, $containerChartRef.current?.clientWidth, timeType])

	return (
		<div className="flex flex-col gap-5">
			<div className="w-40 text-left">
				<SelectInput
					defaultValue={{ text: 'Dia', value: 'day' }}
					label="Agrupar por"
					onChange={(selectedItem: SelectOptions | null) =>
						setTimeType((selectedItem?.value as TimeType) ?? 'day')
					}
					options={[
						{ value: 'day', text: 'Dia' },
						{ value: 'month', text: 'Mes' },
					]}
				/>
			</div>
			<div ref={$containerChartRef} className="h-80 w-full px-3" />
		</div>
	)
}
