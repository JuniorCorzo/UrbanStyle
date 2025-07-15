import { cn } from '@/lib/cn'

interface StepsProps extends React.ComponentPropsWithoutRef<'span'> {
	children?: React.ReactNode
	position?: 'left' | 'right'
}
export function Steps({ className, children, position = 'left', ...props }: StepsProps) {
	return (
		<span
			className={cn(
				'border-border text-text relative flex w-full items-center px-4 py-2',
				className,
			)}
			{...props}
		>
			<span
				className={cn(
					'bg-accent before:border-3 before:border-background before:bg-accent-2 absolute h-full w-1 before:absolute before:top-1/2 before:size-4 before:rounded-full',
					position === 'left' && 'before:-translate-1/2 left-0 before:left-1/2',
					position === 'right' &&
						'right-0 before:right-1/2 before:-translate-y-1/2 before:translate-x-1/2',
				)}
			/>
			<span className={cn(position === 'left' ? 'ml-2' : 'mr-2')}>{children}</span>
		</span>
	)
}
