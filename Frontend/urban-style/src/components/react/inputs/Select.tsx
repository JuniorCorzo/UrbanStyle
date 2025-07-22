import { useSelect } from 'downshift'
import { optionsToString } from '@/lib/optionsToString'
import { cn } from '@/lib/cn'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { SelectList } from './SelectList'
import React, { useEffect, useImperativeHandle, useRef } from 'react'
import { MessageError } from './MessageError'
import type { SelectRefProps, SelectSingleProps } from '@/interface/form-mediator.interface'

export const Select = React.forwardRef<SelectRefProps, SelectSingleProps>(
	(
		{
			className,
			name,
			label,
			placeholder,
			options,
			onChange,
			disable,
			defaultValue,
			isFloating = true,
		},
		ref,
	) => {
		const buttonRef = useRef<HTMLDivElement>(null)

		const {
			isOpen,
			selectedItem,
			getLabelProps,
			getToggleButtonProps,
			getItemProps,
			getMenuProps,
			highlightedIndex,
		} = useSelect({
			items: options ?? [],
			itemToString: optionsToString,
			initialSelectedItem: defaultValue,
		})

		useEffect(() => {
			if (!selectedItem?.value) return
			if (typeof onChange === 'function') onChange(selectedItem)
		}, [selectedItem])

		useImperativeHandle(ref, () => ({
			selectedItems: () => selectedItem,
		}))

		return (
			<div className="relative w-full max-w-md">
				<div
					className={cn('text-text flex w-full flex-col', disable && 'cursor-not-allowed')}
					ref={buttonRef}
				>
					<label
						className="pointer-events-none flex flex-col gap-1 transition-all"
						{...getLabelProps()}
					>
						{label}
						<MessageError errorId={`${name}_error`} />
						<div
							className={cn(
								'bg-background border-border focus:custom-ring pointer-events-auto flex w-full cursor-pointer items-center justify-between rounded border p-2 transition-all',
								disable && 'pointer-events-none',
								className,
							)}
							{...getToggleButtonProps()}
						>
							<input
								className="hidden"
								type="hidden"
								name={name}
								defaultValue={[selectedItem?.value ?? '', selectedItem?.text ?? '']}
								readOnly
							/>
							<span className={cn('text-text/70 text-base', selectedItem && 'text-text')}>
								{selectedItem ? selectedItem.text : placeholder}
							</span>
							<span className="">
								<ChevronDownIcon
									className={cn('size-5 transition-transform duration-150', isOpen && 'rotate-180')}
								/>
							</span>
						</div>
					</label>
				</div>
				<SelectList
					isOpen={isOpen}
					options={options ?? []}
					getMenuProps={getMenuProps}
					getItemProps={getItemProps}
					highlightedIndex={highlightedIndex}
					selectedItem={selectedItem}
					isFloating={isFloating}
				/>
			</div>
		)
	},
)
