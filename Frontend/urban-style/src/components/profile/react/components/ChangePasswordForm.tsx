import { Button } from '@/components/react/Button'
import TextInput from '@/components/react/inputs/TextInput'
import { cn } from '@/lib/cn'
import { useChangePassword } from '../hooks/useChangePassword'
import { ActionsFooter } from './ActionsFooter'
import { HeaderSection } from './HeaderSection'

/**
 * Renders the change password form.
 * This component provides a form for the user to change their password.
 */
export function ChangePasswordForm() {
	const { handleInputChange, canSubmit, sendRequest } = useChangePassword()

	return (
		<>
			<div className="flex h-full flex-col gap-2 px-5 md:px-11">
				<HeaderSection
					title="Cambiar contraseña"
					description="Para mantener tu cuenta segura, te recomendamos cambiar tu contraseña periódicamente. Elige una contraseña fuerte que no uses en otros sitios."
				/>
				<div className="grid items-end gap-3 md:grid-cols-2">
					<TextInput
						name="oldPassword"
						label="Contraseña actual"
						placeholder="Ingresa tu contraseña actual"
						type="password"
						onChange={handleInputChange}
					/>
					<TextInput
						name="newPassword"
						label="Nueva contraseña"
						placeholder="Mínimo 8 caracteres"
						type="password"
						onChange={handleInputChange}
					/>
					<TextInput
						name="confirmPassword"
						label="Confirmar nueva contraseña"
						placeholder="Confirma tu nueva contraseña"
						type="password"
						onChange={handleInputChange}
					/>
				</div>
				<ActionsFooter canSubmit={canSubmit} sendFn={sendRequest} />
			</div>
		</>
	)
}
