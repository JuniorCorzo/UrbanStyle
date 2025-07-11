import { useMultipleSelection, useSelect } from 'downshift'
import type { SelectInputProps } from './SelectInput'
import { getItemsFilter } from '@/lib/getItemsFilter'
import type { SelectOptions } from '@/interface/form-mediator.interface'
import { ChevronDownIcon, TrashIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/cn'
import { SelectList } from './SelectList'
import { MessageError } from './MessageError'
import { useEffect } from 'react'

export interface SelectMultipleProps extends Omit<SelectInputProps, 'value'> {
	value?: SelectOptions[]
}

export function SelectMultiple({
	name,
	label,
	placeholder,
	options,
	value = [],
}: SelectMultipleProps) {
	const {
		selectedItems,
		setSelectedItems,
		getSelectedItemProps,
		getDropdownProps,
		addSelectedItem,
		removeSelectedItem,
	} = useMultipleSelection<SelectOptions>({
		initialSelectedItems: value,
	})

	useEffect(() => setSelectedItems(value), [])

	const items = options?.filter(getItemsFilter(selectedItems)) ?? []
	const {
		isOpen,
		selectedItem,
		getLabelProps,
		getToggleButtonProps,
		getItemProps,
		getMenuProps,
		highlightedIndex,
	} = useSelect({
		selectedItem: null,
		defaultHighlightedIndex: 0,
		items,
		stateReducer: (_, { changes, type }) => {
			switch (type) {
				case useSelect.stateChangeTypes.ToggleButtonKeyDownEnter:
				case useSelect.stateChangeTypes.ToggleButtonKeyDownSpaceButton:
				case useSelect.stateChangeTypes.ItemClick:
					return {
						...changes,
						isOpen: true,
						highlightedIndex: 0,
					}
			}
			return changes
		},
		onStateChange: ({ type, selectedItem: newSelectedItem }) => {
			switch (type) {
				case useSelect.stateChangeTypes.ToggleButtonKeyDownEnter:
				case useSelect.stateChangeTypes.ToggleButtonKeyDownSpaceButton:
				case useSelect.stateChangeTypes.ItemClick:
				case useSelect.stateChangeTypes.ToggleButtonBlur:
					if (newSelectedItem) {
						addSelectedItem(newSelectedItem)
					}

					break
				default:
					break
			}
		},
	})

	return (
		<div className="relative w-full max-w-md">
			<div className="flex flex-col gap-1">
				<label
					className="pointer-events-none flex flex-col gap-1 transition-all"
					{...getLabelProps()}
				>
					{label}
					<MessageError errorId={`${name}_error`} />
					<div className="bg-background border-border focus-within:custom-ring pointer-events-auto inline-flex w-full flex-wrap items-center gap-1 rounded border p-1">
						<input
							className="hidden"
							name={name}
							type="hidden"
							readOnly
							defaultValue={JSON.stringify(selectedItems)}
						/>
						{selectedItems.map((item, index) => (
							<span
								className="bg-accent focus:custom-ring flex items-center justify-between rounded-md px-1 py-0.5"
								key={`selected-item-${index}`}
								{...getSelectedItemProps({
									selectedItem: item,
									index,
								})}
							>
								<span>{item.text}</span>
								<span
									className="cursor-pointer px-1"
									onClick={(event) => {
										event.stopPropagation()
										removeSelectedItem(item)
									}}
								>
									&#10005;
								</span>
							</span>
						))}
						<div
							className="flex w-full cursor-pointer items-center justify-between px-2 py-1"
							{...getToggleButtonProps(getDropdownProps({ preventKeyAction: isOpen }))}
						>
							<span className="text-text/70">{placeholder}</span>
							<span>
								<ChevronDownIcon
									className={cn('size-5 transition-transform duration-150', isOpen && 'rotate-180')}
								/>
							</span>
						</div>
					</div>
				</label>
			</div>
			<SelectList
				isOpen={isOpen}
				options={items}
				getMenuProps={getMenuProps}
				getItemProps={getItemProps}
				highlightedIndex={highlightedIndex}
				selectedItem={selectedItem}
			/>
		</div>
	)
}
