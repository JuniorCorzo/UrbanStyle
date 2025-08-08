import TextInput from '@/components/react/inputs/TextInput'
import { ActionsFooter } from './ActionsFooter'
import { usePersonalData } from '../hooks/usePersonalData'

export function PersonalData() {
	const { user, userValues, handleChange, reset, canSubmit, canReset, sendRequest } =
		usePersonalData()
	const { name, email, phone } = user ?? {}
	console.log(canReset)
	return (
		<>
			<div className="flex h-full flex-col gap-3 px-6">
				<span className="text-lg font-medium tracking-wide">Editar perfil</span>
				<div className="grid h-fit grid-cols-1 gap-5 md:grid-cols-2">
					<TextInput
						name="name"
						className="max-h-12"
						label="Nombre de Usuario"
						value={userValues.get('name') ?? name}
						onChange={(event) => handleChange(event, 'name')}
					/>
					<TextInput
						name="email"
						label="Email"
						value={userValues.get('email') ?? email}
						onChange={(event) => handleChange(event, 'email')}
					/>
					<TextInput
						name="phone"
						label="Teléfono"
						value={userValues.get('phone') ?? phone}
						onChange={(event) => handleChange(event, 'phone')}
					/>
				</div>
			</div>
			<ActionsFooter
				canSubmit={canSubmit}
				canReset={canReset}
				resetFn={reset}
				sendFn={sendRequest}
			/>
		</>
	)
}
