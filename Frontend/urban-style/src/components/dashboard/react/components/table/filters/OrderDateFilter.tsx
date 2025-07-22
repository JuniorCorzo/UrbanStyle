import {
	ArrowLongRightIcon,
	CalendarDaysIcon,
	ChevronDownIcon,
	ChevronUpIcon,
} from '@heroicons/react/24/outline'
import 'cally'
import { CalendarRange } from '../../CalendarRange'
import { useRef, useState } from 'react'
import { cn } from '@/lib/cn'
import { tableStore } from '@/state/table.state'

type DateState = {
	initialDate: string
	lastDate: string
}

export function OrderDateFilter() {
	const [isOpen, setOpen] = useState(false)
	const [dateState, setDateState] = useState<DateState>()
	const calendarContainerRef = useRef<HTMLDivElement>(null)

	const handleClick = () => {
		setOpen((prev) => !prev)
	}

	const updateTableState = (value: string) => {
		const columnsFilter =
			tableStore.get().columnFilters?.filter(({ id }) => id !== 'orderDate') ?? []

		tableStore.setKey('columnFilters', [...columnsFilter, { id: 'orderDate', value: value }])
	}

	const handleOnChange = (event: Event) => {
		const target = event.target as HTMLInputElement
		const [initialDate, lastDate] = target.value.split('/')

		setDateState({
			initialDate,
			lastDate,
		})
		updateTableState(target.value)
	}

	return (
		<div>
			<div
				className="border-border inline-flex cursor-pointer items-center rounded-md border px-3 py-1"
				onClick={handleClick}
			>
				<span className="inline-flex w-full justify-center gap-3">
					<span>
						<CalendarDaysIcon className="size-6" />
					</span>
					<span className="inline-flex items-center gap-2">
						{dateState && (
							<>
								<span>{dateState.initialDate}</span>
								<span>
									<ArrowLongRightIcon className="w-5" />
								</span>
								<span>{dateState.lastDate}</span>
							</>
						)}
						{!dateState && (
							<>
								<span>Desde</span>
								<span>
									<ArrowLongRightIcon className="w-5" />
								</span>
								<span>Hasta</span>
							</>
						)}
					</span>
					<span>
						{isOpen ? <ChevronUpIcon className="size-5" /> : <ChevronDownIcon className="size-5" />}
					</span>
				</span>
			</div>
			<CalendarRange
				ref={calendarContainerRef}
				onchange={handleOnChange}
				className={cn(
					'border-border absolute z-50 mx-auto mt-1 rounded-md border p-4',
					isOpen ? 'block' : 'hidden',
				)}
			/>
		</div>
	)
}
