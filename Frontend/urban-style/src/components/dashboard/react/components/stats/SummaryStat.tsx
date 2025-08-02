export type SummaryStatProps = {
	label: string
	value: string | number
	title?: string | number
}

export function SummaryStat({ label, value, title }: SummaryStatProps) {
	return (
		<div
			className="border-border flex flex-col items-center justify-center gap-1 rounded border px-3 py-1 md:px-3 md:py-2.5"
			title={title?.toString()}
			aria-label={title?.toString()}
		>
			<span className="text-text text-xs md:text-sm">{label}</span>
			<span className="text-text text-lg font-bold md:text-xl">{value}</span>
		</div>
	)
}
