export type SummaryStatProps = {
	label: string
	value: string | number
	title?: string | number
}

export function SummaryStat({ label, value, title }: SummaryStatProps) {
	return (
		<div
			className="border-border flex flex-col items-center justify-center gap-1 rounded border px-5 py-2.5"
			title={title}
			aria-label={title}
		>
			<span className="text-text w-full text-left text-sm md:text-base">{label}</span>
			<span className="text-text text-xl font-bold md:text-5xl">{value}</span>
		</div>
	)
}
