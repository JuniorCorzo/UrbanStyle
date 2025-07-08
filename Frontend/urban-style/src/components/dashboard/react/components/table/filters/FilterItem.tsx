import { cn } from '@/lib/cn'
import { useDropdownContext } from '../../../context/DropdownContext'
import { CheckIcon } from '@heroicons/react/24/outline'
import { forwardRef, useImperativeHandle, useState, type ChangeEvent } from 'react'

interface Props extends React.ComponentPropsWithoutRef<'div'> {
	name: string
	columnId: string
	handleDispatchChecked: (checkedValue: string, columnId: string, isChecked: boolean) => void
}

export function FilterItem({ name, className, columnId, handleDispatchChecked }: Props) {
	const { isOpen, getItemProps } = useDropdownContext()

	const handleChange = (event: ChangeEvent<HTMLInputElement>, columnId: string, name: string) =>
		handleDispatchChecked(name, columnId, event.target.checked)

	return (
		<div
			className={cn(
				'hover:bg-accent hover:text-crust flex w-full select-none items-center justify-start gap-2 rounded-md px-2 py-1.5 transition-all duration-200 hover:scale-105 hover:font-medium',
				className,
			)}
			{...getItemProps({ item: name })}
		>
			<label className="flex w-full items-center gap-2" htmlFor={name.toLowerCase()}>
				<div className="relative aspect-square size-5">
					<input
						id={name.toLowerCase()}
						className="bg-background border-border checked:bg-accent-2 focus:custom-ring peer size-5 appearance-none rounded border transition-colors duration-150 focus:outline-none"
						type="checkbox"
						onChange={(event) => handleChange(event, columnId, name)}
					/>
					<CheckIcon
						className={cn(
							'-translate-1/2 text-crust stroke-3 invisible absolute left-1/2 top-1/2 size-4 rounded-full stroke-current transition-all duration-75 peer-checked:visible',
							!isOpen && 'hidden',
						)}
					/>
				</div>
				<span>{name}</span>
			</label>
		</div>
	)
}
