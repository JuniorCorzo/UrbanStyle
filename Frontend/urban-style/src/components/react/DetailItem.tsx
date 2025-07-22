import { cn } from '@/lib/cn'

interface DetailItemProps extends React.ComponentPropsWithoutRef<'span'> {
	label: string
	value: string
	classNameValue?: string
}

export function DetailItem({ label, value, classNameValue, className, ...props }: DetailItemProps) {
	return (
		<span
			className={cn(
				'inline-flex flex-col justify-between gap-x-1 font-normal sm:flex-row sm:justify-start',
				className,
			)}
			title={value}
			{...props}
		>
			{label}: <strong className={cn('font-medium', classNameValue)}>{value}</strong>
		</span>
	)
}
