import type { SelectOptions } from '@/interface/form-mediator.interface'
import { cn } from '@/lib/cn'
import type { SelectOptionsProps } from './SelectList'

interface Props
	extends Omit<SelectOptionsProps, 'isOpen' | 'options' | 'getMenuProps' | 'showAbove'> {
	index: number
	item: SelectOptions
}

function SelectItem({ getItemProps, highlightedIndex, selectedItem, index, item }: Props) {
	const { text, value } = item

	return (
		<li
			className={cn(
				'bg-background flex flex-col px-3 py-2',
				highlightedIndex === index && 'bg-accent',
				selectedItem?.value === value && 'bg-accent font-bold',
			)}
			key={`${value}${index}`}
			{...getItemProps({ item: { text, value }, index })}
		>
			<span>{text}</span>
		</li>
	)
}

export default SelectItem
