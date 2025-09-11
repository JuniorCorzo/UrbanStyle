import { Button } from '@/components/react/Button'
import TextInput from '@/components/react/inputs/TextInput'
import { cn } from '@/lib/cn'
import { useChangePassword } from '../hooks/useChangePassword'
import { ActionsFooter } from './ActionsFooter'

export function UserSecurity() {
	const { isPassword, handleInputChange, handleValidatePassword, canSubmit, sendRequest } =
		useChangePassword()

	return (
		<>
			<div className="flex h-full flex-col gap-3 px-5 md:px-11">
				<span className="text-lg font-medium tracking-wide">Cambiar contraseña</span>
				<div className="grid items-end gap-3 md:grid-cols-2">
					<span className="max-xs:flex-col xs:items-end col-span-full flex gap-x-5 gap-y-3">
						<TextInput
							name="oldPassword"
							className={cn(
								isPassword && 'border-green-1 focus:border-green-1 border-2 focus:ring-0',
								isPassword === false && 'border-red focus:border-red border-2 focus:shadow-none',
							)}
							label="Contraseña actual"
							placeholder="Ingresa tu contraseña actual"
							type="password"
							onChange={handleInputChange}
						/>
						<Button
							className="h-full max-h-10 text-nowrap font-semibold"
							size="sm"
							onClick={handleValidatePassword}
						>
							Verificar Contraseña
						</Button>
					</span>
					<TextInput
						name="newPassword"
						label="Nueva contraseña"
						placeholder="Mínimo 8 caracteres"
						type="password"
						onChange={handleInputChange}
						disabled={!isPassword}
					/>
					<TextInput
						name="confirmPassword"
						label="Confirmar nueva contraseña"
						placeholder="Confirma tu nueva contraseña"
						type="password"
						onChange={handleInputChange}
						disabled={!isPassword}
					/>
				</div>
			</div>
			<ActionsFooter canSubmit={canSubmit} sendFn={sendRequest} />
		</>
	)
}
