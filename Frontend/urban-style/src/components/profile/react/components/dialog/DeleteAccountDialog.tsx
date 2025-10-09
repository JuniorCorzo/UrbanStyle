import ModalHeader from '@/components/dashboard/react/components/modals/ModalHeader'
import { Button } from '@/components/react/Button'
import TextInput from '@/components/react/inputs/TextInput'
import { useDeleteAccountDialog } from '../../hooks/useDeleteAccountDialog'

export type DeleteAccountDialogRef = {
	showModal: () => void
	close: () => void
}

/**
 * @property ref - A ref to the dialog component.
 */
type DeleteAccountDialogProps = {
	ref: React.RefObject<DeleteAccountDialogRef | null>
}

/**
 * Renders the delete account dialog.
 * This component provides a confirmation dialog for account deletion, requiring the user to enter their password.
 * @param {DeleteAccountDialogProps} props - The component props.
 */
export function DeleteAccountDialog({ ref }: DeleteAccountDialogProps) {
	const { dialogRef, isPasswordValid, handleInputChange, handleDeleteAccount, handleClose } =
		useDeleteAccountDialog(ref)

	return (
		<dialog
			ref={dialogRef}
			id="delete_account_dialog"
			className="-translate-1/2 fixed inset-0 left-1/2 top-1/2 z-[999] w-full max-w-xl bg-transparent px-3"
		>
			<div className="bg-background border-border shadow-crust overflow-visible rounded-md border-2 shadow-md">
				<ModalHeader title="¿Eliminar tu Cuenta?" handleModal={handleClose} />
				<div className="bg-background flex flex-col gap-6 p-6">
					<p className="prose">
						Estás a punto de eliminar tu cuenta. Esta acción es irreversible y se borrarán los
						siguientes datos asociados a ella:
						<ul className="list-inside list-disc">
							<li> Correo electrónico</li>
							<li> Número de teléfono</li>
							<li> Direcciones guardadas</li>
							<li> Contraseña</li>
						</ul>
						Por motivos legales, tu nombre y el historial de órdenes realizadas se conservarán en
						nuestros registros.
					</p>
					<div>
						<TextInput
							type="password"
							name="password"
							label="Para confirmar, escribe tu contraseña actual:"
							placeholder="Contraseña actual"
							onChange={handleInputChange}
						/>
					</div>
					<div className="inline-flex gap-2 self-end">
						<Button
							className="border-0 bg-transparent hover:border"
							onClick={handleClose}
							size="sm"
						>
							Cancelar
						</Button>
						<Button
							className="bg-red border-red shadow-red-2 text-slate-100"
							onClick={handleDeleteAccount}
							disabled={!isPasswordValid}
							size="sm"
						>
							Eliminar Cuenta
						</Button>
					</div>
				</div>
			</div>
		</dialog>
	)
}
