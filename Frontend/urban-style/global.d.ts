import type {
	CalendarRangeProps,
	CalendarMonthProps,
	CalendarDateProps,
	CalendarMultiProps,
} from 'cally'
import { type ChangeVariantEvent } from '@/lib/custom-events/change-variants'

type CustomEventsMap = {
	'product:change-variant': CustomEvent<ChangeVariantEvent>
}

declare global {
	interface Document {
		addEventListener<K extends keyof CustomEventsMap>(
			type: K,
			listener: (this: Document, event: CustomEventsMap[k]) => any,
			options?: boolean | AddEventListenerOptions,
		): void
	}
}

type MapEvents<T> = {
	[K in keyof T as K extends `on${infer E}` ? `on${Lowercase<E>}` : K]: T[K]
}

declare module 'react' {
	namespace JSX {
		interface IntrinsicElements {
			'calendar-month': MapEvents<CalendarMonthProps> & React.HTMLAttributes<HTMLElement>
			'calendar-range': MapEvents<CalendarRangeProps> & React.HTMLAttributes<HTMLElement>
			'calendar-date': MapEvents<CalendarDateProps> & React.HTMLAttributes<HTMLElement>
			'calendar-multi': MapEvents<CalendarMultiProps> & React.HTMLAttributes<HTMLElement>
		}
	}
}
