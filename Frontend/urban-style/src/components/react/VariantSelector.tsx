type VarianSelectorProps = {
	value: string
	text: string
	selected: boolean
	onSelect: (value: string) => void
}

export function VariantSelector({ value, text, selected, onSelect }: VarianSelectorProps) {
	return (
		<label className="flex h-fit items-center justify-between hover:scale-105">
			<input
				type="checkbox"
				checked={selected}
				onChange={() => onSelect(value)}
				className="peer hidden size-0 overflow-hidden whitespace-nowrap opacity-0"
				data-value={value}
			/>
			<span className="bg-accent-2 border-border hover:border-crust peer-checked:bg-crust cursor-pointer rounded-md border px-2 py-0.5 font-medium transition-all ease-in-out peer-checked:text-slate-100">
				{text}
			</span>
		</label>
	)
}
