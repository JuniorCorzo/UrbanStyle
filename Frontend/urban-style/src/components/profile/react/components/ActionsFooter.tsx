import { Button } from '@/components/react/Button'
import { cn } from '@/lib/cn'

type ActionFooterProps = {
	canSubmit: boolean
	sendFn: () => void
	canReset?: boolean
	resetFn?: () => void
}

export function ActionsFooter({ canSubmit, canReset, resetFn, sendFn }: ActionFooterProps) {
	return (
		<div
			className={cn(
				'bg-foreground/90 bottom-0 flex w-full gap-5 px-5 py-2 backdrop-blur-lg',
				canReset ? 'justify-between' : 'justify-end',
			)}
		>
			<Button
				className={cn(!canReset && 'hidden')}
				size="sm"
				disabled={!canReset}
				onClick={resetFn}
			>
				Reset
			</Button>
			<Button className="" size="sm" disabled={!canSubmit} onClick={sendFn}>
				Confirmar
			</Button>
		</div>
	)
}
