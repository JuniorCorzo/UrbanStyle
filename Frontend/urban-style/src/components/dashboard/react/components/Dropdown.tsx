import { cn } from '@/lib/cn'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'
import { useSelect } from 'downshift'
import React, { type ReactNode } from 'react'
import { DropdownContext, useDropdownContext } from '../context/DropdownContext'

interface DropdownProps extends React.ComponentPropsWithoutRef<'div'> {
	label?: string
	children: ReactNode
}

export function Dropdown({ label, className, children }: DropdownProps) {
	const {
		isOpen,
		getItemProps,
		getMenuProps,
		getLabelProps,
		highlightedIndex,
		getToggleButtonProps,
	} = useSelect({
		items: [],
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
	})

	return (
		<DropdownContext.Provider value={{ isOpen, getItemProps, getMenuProps, highlightedIndex }}>
			<div>
				<div
					className={cn('flex w-full cursor-pointer items-center justify-between gap-1', className)}
					aria-label="toggle menu"
					{...getToggleButtonProps()}
				>
					<label className="pointer-events-none" {...getLabelProps()}>
						{label}
					</label>
					{isOpen ? <ChevronUpIcon className="size-6" /> : <ChevronDownIcon className="size-6" />}
				</div>
				{React.Children.map(children, (child) => child)}
			</div>
		</DropdownContext.Provider>
	)
}

interface DropdownMenuProps extends React.ComponentPropsWithoutRef<'ul'> {
	children: React.ReactNode
}

Dropdown.Menu = ({ className, children }: DropdownMenuProps) => {
	const { getMenuProps, isOpen } = useDropdownContext()

	return (
		<ul
			className={cn(
				'border-border shadow-crust visible flex max-h-40 w-full flex-col items-center gap-1 border shadow',
				!isOpen && 'hidden max-h-0',
				className,
			)}
			{...getMenuProps()}
		>
			{React.Children.map(children, (child) => child)}
		</ul>
	)
}
