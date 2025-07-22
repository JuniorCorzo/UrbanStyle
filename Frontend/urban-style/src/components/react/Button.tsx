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
				'bg-accent-2/70 backdrop-blur-xs backdrop-brightness-80 text-text border-border shadow-accent-2 cursor-pointer rounded border text-lg font-semibold hover:shadow',
				className,
			)}
			{...props}
		>
			{children}
		</button>
	)
}
