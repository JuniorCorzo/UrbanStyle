import { Button } from '@/components/react/Button'
import { HeaderSection } from './HeaderSection'
import { DeleteAccountDialog, type DeleteAccountDialogRef } from './dialog/DeleteAccountDialog'
import { useRef } from 'react'

/**
 * Renders the delete account section in the user profile.
 * This component displays information about account deletion and a button to open the delete account dialog.
 */
export function DeleteAccount() {
	const dialogRef = useRef<DeleteAccountDialogRef>(null)

	return (
		<div className="flex h-full w-full items-center justify-between gap-2 px-5 pb-5 md:px-11">
			<HeaderSection
				title="Eliminar cuenta"
				description="Una vez que elimines tu cuenta, perderás acceso a todos tus datos, historial de pedidos y configuraciones. Esta acción es irreversible."
			/>

			<Button
				className="bg-red border-red text-nowrap border-2 text-slate-100"
				size="sm"
				onClick={() => dialogRef.current?.showModal()}
			>
				Eliminar cuenta
			</Button>
			<DeleteAccountDialog ref={dialogRef} />
		</div>
	)
}
