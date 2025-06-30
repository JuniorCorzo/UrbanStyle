import type { SelectOptions } from '@/interface/form-mediator.interface'
import { useState, type KeyboardEvent } from 'react'
import { getItemFilter } from '@/lib/getItemsFilter'
import { useCombobox } from 'downshift'
import { optionsToString } from '@/lib/optionsToString'
import { cn } from '@/lib/cn'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { SelectList } from './SelectList'
import type { ComboboxInputProps } from './ComboboxInput'
import { MessageError } from './MessageError'

export function Combobox({ name, label, placeholder, options = [], value }: ComboboxInputProps) {
	const [items, setItems] = useState<SelectOptions[]>(options)

	const {
		isOpen,
		getToggleButtonProps,
		getLabelProps,
		getMenuProps,
		getItemProps,
		getInputProps,
		selectedItem,
		selectItem,
		highlightedIndex,
	} = useCombobox({
		items,
		onInputValueChange({ inputValue }) {
			setItems(options.filter(getItemFilter(inputValue)))
		},
		itemToString(item) {
			return optionsToString(item)
		},
	})

	const handleEnter = (event: KeyboardEvent<HTMLInputElement>) => {
		if (event.key !== 'Enter') return

		const $input = event.target as HTMLInputElement
		const value = $input.value

		if (!value) return
		const newOptions: SelectOptions = {
			text: value,
			value: value.toLowerCase(),
		}

		selectItem(newOptions)
	}

	return (
		<div className="relative w-full max-w-md">
			<div className="flex flex-col gap-1">
				<label className="pointer-events-none flex flex-col gap-1" {...getLabelProps()}>
					{label}
					<MessageError errorId={`${name}_error`} />
					<div>
						<div className="bg-background border-border focus-within:custom-ring pointer-events-auto inline-flex w-full flex-wrap items-center gap-1 rounded border p-0.5">
							<div className="flex w-full cursor-pointer items-center justify-between px-2 py-1">
								<input
									placeholder={placeholder}
									name={name}
									className="w-full focus:outline-0"
									tabIndex={0}
									{...getInputProps({
										onKeyDown: handleEnter,
									})}
								/>
								<button aria-label="toggle menu" type="button" {...getToggleButtonProps()}>
									<ChevronDownIcon
										className={cn(
											'size-5 transition-transform duration-150',
											isOpen && 'rotate-180',
										)}
									/>
								</button>
							</div>
						</div>
					</div>
				</label>
			</div>
			<SelectList
				getItemProps={getItemProps}
				getMenuProps={getMenuProps}
				options={items}
				highlightedIndex={highlightedIndex}
				isOpen={isOpen}
				selectedItem={selectedItem}
			/>
		</div>
	)
}
