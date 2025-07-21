import type { SelectOptions } from '@/interface/form-mediator.interface'
import { cn } from '@/lib/cn'
import SelectItem from './SelectItem'
import { useLayoutEffect, useRef, useState } from 'react'
import type { UseComboboxReturnValue, UseSelectReturnValue } from 'downshift'

export type GetItemsProps<T> = UseSelectReturnValue<T>['getItemProps']
export type GetMenuProps<T> =
	| UseSelectReturnValue<T>['getMenuProps']
	| UseComboboxReturnValue<T>['getMenuProps']

export interface SelectOptionsProps {
	isOpen: boolean
	options: SelectOptions[]
	highlightedIndex: number
	selectedItem: SelectOptions | null
	getItemProps: GetItemsProps<SelectOptions>
	getMenuProps: GetMenuProps<SelectOptions>
	isFloating?: boolean
}

export function SelectList({
	isOpen,
	options,
	getItemProps,
	getMenuProps,
	highlightedIndex,
	selectedItem,
	isFloating,
}: SelectOptionsProps) {
	const buttonRef = useRef<HTMLUListElement>(null)
	const [showAbove, setShowAbove] = useState(false)

	useLayoutEffect(() => {
		if (!buttonRef.current) return

		const rect = buttonRef.current.getBoundingClientRect()
		const spaceBelow = window.innerHeight - rect.bottom

		setShowAbove(spaceBelow < 0)
	}, [isOpen])

	return (
		<ul
			className={cn(
				'visible z-50 mt-1 max-h-80 w-full overflow-y-auto rounded opacity-100 landscape:max-h-52',
				isOpen
					? 'border-border shadow-crust border shadow transition-all duration-150'
					: 'invisible opacity-0',
				showAbove && 'bottom-full',
				isFloating && 'absolute',
			)}
			{...getMenuProps({
				ref: buttonRef,
			})}
		>
			{isOpen &&
				options?.map(({ text, value }, index) => (
					<SelectItem
						getItemProps={getItemProps}
						highlightedIndex={highlightedIndex}
						index={index}
						item={{ text, value }}
						selectedItem={selectedItem}
						key={value}
					/>
				))}
		</ul>
	)
}
