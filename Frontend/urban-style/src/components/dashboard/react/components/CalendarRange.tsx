import { cn } from '@/lib/cn'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import type { CalendarRangeProps } from 'cally'
import '@/styles/calendar.css'

type MapEvents<T> = {
	[K in keyof T as K extends `on${infer E}` ? `on${Lowercase<E>}` : K]: T[K]
}

interface Props extends MapEvents<CalendarRangeProps> {
	className?: string
	ref?: React.Ref<HTMLDivElement>
}

export function CalendarRange({ className, ref, ...props }: Props) {
	return (
		<div className={cn('bg-background w-fit', className)} ref={ref}>
			<calendar-range {...props}>
				<div slot="previous">
					<ChevronLeftIcon className="size-6" />
				</div>
				<div slot="next">
					<ChevronRightIcon className="size-6" />
				</div>
				<div className="grid w-fit grid-cols-1 gap-3 uppercase lg:grid-cols-2">
					<calendar-month />
					<calendar-month className="hidden lg:block" offset={1} />
				</div>
			</calendar-range>
		</div>
	)
}
