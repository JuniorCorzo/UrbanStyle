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
		<div className={cn('bottom-0 flex w-full justify-end gap-5 py-2 backdrop-blur-lg')}>
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
