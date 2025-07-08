import { Button } from '@/components/react/Button'
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline'
import React from 'react'

interface FiltersButtonProps {
	onClick: () => void
	children?: React.ReactNode
}

export function FiltersButton({ onClick, children }: FiltersButtonProps) {
	return (
		<div className="flex items-center gap-2">
			{children}
			<Button
				onClick={onClick}
				className="bg-secondary hover:shadow-border flex max-h-10 items-center gap-2"
				size="md"
			>
				<AdjustmentsHorizontalIcon className="size-6" />
				<span>Filtros</span>
			</Button>
		</div>
	)
}
