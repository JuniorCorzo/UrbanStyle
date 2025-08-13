import { OPTIONS_TAB, useOptionsTab, type Options } from '../hooks/useOptionsTab'

export function OptionsTab() {
	const { selectedItem, handleClick } = useOptionsTab()

	return (
		<div className="border-border/70 inline-flex w-full items-center justify-center border-b-2 px-5">
			<div className="inline-flex w-fit gap-5 rounded-md px-5" onClick={handleClick}>
				{Object.keys(OPTIONS_TAB).map((opt) => (
					<span
						className="aria-selected:border-border border-b-3 hover:border-border relative top-0.5 cursor-pointer border-transparent px-3 py-1 transition-all duration-200 hover:scale-110 aria-selected:font-medium"
						aria-selected={selectedItem === opt}
						data-value={opt}
						onClick={handleClick}
					>
						{OPTIONS_TAB[opt as Options]}
					</span>
				))}
			</div>
		</div>
	)
}
