import { cn } from '@/lib/cn'

interface ProductDetailProps extends React.ComponentPropsWithoutRef<'div'> {
	label: string
	children: React.ReactNode
}

export function ProductDetail({ label, children, className }: ProductDetailProps) {
	return (
		<div
			className={cn(
				'border-border flex h-fit w-fit max-w-sm flex-col gap-2 overflow-auto rounded-lg border px-5 py-3 sm:max-w-xl',
				className,
			)}
		>
			<span className="font-medium uppercase">{label}</span>
			{children}
		</div>
	)
}
