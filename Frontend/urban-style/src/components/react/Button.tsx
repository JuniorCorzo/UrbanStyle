import { cn } from '@/lib/cn'
import type { ReactNode } from 'react'
import { sizeClasses } from '../Button.astro'
import type React from 'react'

interface Props extends React.ComponentPropsWithoutRef<'button'> {
	id?: string
	size?: 'sm' | 'md' | 'lg' | 'custom'
	className?: string
	children: ReactNode | undefined
}

export function Button({ id, size = 'md', children, className, ...props }: Props) {
	return (
		<button
			id={id}
			className={cn(
				sizeClasses[size],
				'bg-accent-2 text-text border-border shadow-accent-2 not-disabled:hover:scale-105 not-disabled:hover:shadow cursor-pointer rounded border text-lg font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-90',
				className,
			)}
			{...props}
		>
			{children}
		</button>
	)
}
