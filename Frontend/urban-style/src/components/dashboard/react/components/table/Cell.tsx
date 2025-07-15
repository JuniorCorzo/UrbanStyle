import { cn } from '@/lib/cn'
import { type ReactNode } from 'react'

interface Props extends React.ComponentProps<'td'> {
	children: ReactNode
}

interface CellChildrenProps extends React.ComponentProps<'div'> {
	children: ReactNode
}

export function Cell({ children, className, ...props }: Props) {
	return (
		<td
			className={cn('group-hover:bg-foreground h-full min-h-11 w-full text-center', className)}
			{...props}
		>
			{children}
		</td>
	)
}

Cell.Span = ({ children: contentText, className, ...props }: CellChildrenProps) => (
	<span
		className={cn('flex w-full items-center justify-center text-balance px-3 py-2', className)}
		{...props}
	>
		{contentText}
	</span>
)

Cell.List = ({ children, className }: CellChildrenProps) => (
	<ul className={cn('grid min-h-full auto-rows-fr', className)}>{children}</ul>
)

Cell.ListItem = ({ children, className }: CellChildrenProps) => (
	<li
		className={cn(
			'not-last:border-b border-border flex h-full w-full items-center justify-center',
			className,
		)}
	>
		{children}
	</li>
)

Cell.TagsContainer = ({ children, className }: CellChildrenProps) => (
	<span className={cn('flex flex-wrap justify-center gap-2 py-2')}>{children}</span>
)

Cell.Tag = ({ children, className }: CellChildrenProps) => (
	<span className={cn('bg-accent/95 rounded px-2 py-0.5 backdrop-blur-sm', className)}>
		{children}
	</span>
)

Cell.Paragraph = ({ children, className }: CellChildrenProps) => (
	<p className={cn('prose text-pretty px-3 text-left', className)}>{children}</p>
)
