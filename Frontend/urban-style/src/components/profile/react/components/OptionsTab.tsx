import { Tag } from '@/components/react/Tag'
import { OPTIONS_TAB, useOptionsTab, type Options } from '../hooks/useOptionsTab'

export function OptionsTab() {
	const { selectedItem, handleClick } = useOptionsTab()

	return (
		<div className="inline-flex w-full items-center justify-center px-5">
			<div
				className="bg-foreground border-border shadow-border inline-flex w-fit gap-5 rounded-md border px-5 py-2 shadow-md"
				onClick={handleClick}
			>
				{Object.keys(OPTIONS_TAB).map((opt) => (
					<Tag
						key={opt.toLowerCase()}
						label={OPTIONS_TAB[opt as Options]}
						value={opt}
						selectedItem={selectedItem}
						data-value={opt}
					/>
				))}
			</div>
		</div>
	)
}
