import { cn } from '@/lib/cn'
import type React from 'react'

type TagProps = {
	label?: string
	value?: string
	selectedItem?: string
} & React.ComponentPropsWithoutRef<'span'>

export function Tag({ label, value, selectedItem, onClick, ...props }: TagProps) {
	return (
		<span
			className={cn(
				'bg-foreground border-border shadow-border cursor-pointer rounded-lg border px-2 py-0.5 text-sm transition-all',
				value === selectedItem ? 'bg-accent custom-ring' : 'shadow-inner',
			)}
			aria-selected={value === selectedItem}
			{...props}
		>
			{label}
		</span>
	)
}
