import { cn } from '@/lib/cn'
import { useDropdownContext } from '../../../context/DropdownContext'
import { CheckIcon } from '@heroicons/react/24/outline'
import { useFilterContext } from '../../../context/FilterContext'

interface Props extends React.ComponentPropsWithoutRef<'div'> {
	label?: string
	value: string
	columnId: string
}

export function FilterItem({ label, value, className, columnId }: Props) {
	const { isOpen, getItemProps } = useDropdownContext()
	const { filterState, filterDispatch } = useFilterContext()
	const isChecked = filterState.some(
		({ id, value: filterValue }) => filterValue === value && id === columnId,
	)

	const handleChange = () => {
		if (!isChecked) {
			filterDispatch({ type: 'ADD_VALUE', payload: { id: columnId, value } })
			return
		}

		filterDispatch({ type: 'DELETE_VALUE', payload: { id: columnId, value } })
	}

	return (
		<div
			className={cn(
				'hover:bg-accent hover:text-crust flex w-full select-none items-center justify-start gap-2 rounded-md px-2 py-1.5 transition-all duration-200 hover:scale-105 hover:font-medium',
				className,
			)}
			{...getItemProps({ item: value })}
		>
			<label className="flex w-full items-center gap-2" htmlFor={value.toLowerCase()}>
				<div className="relative aspect-square size-5">
					<input
						id={value.toLowerCase()}
						className="bg-background border-border checked:bg-accent-2 focus:custom-ring peer size-5 appearance-none rounded border transition-colors duration-150 focus:outline-none"
						type="checkbox"
						onChange={handleChange}
						checked={isChecked}
					/>
					<CheckIcon
						className={cn(
							'-translate-1/2 text-crust stroke-3 invisible absolute left-1/2 top-1/2 size-4 rounded-full stroke-current transition-all duration-75 peer-checked:visible',
							!isOpen && 'hidden',
						)}
					/>
				</div>
				<span>{label || value}</span>
			</label>
		</div>
	)
}
