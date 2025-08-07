import TextInput from '@/components/react/inputs/TextInput'
import { userStore } from '@/state/user.state'
import { useStore } from '@nanostores/react'

export function PersonalData() {
	const user = useStore(userStore)
	const { name, email, phone } = user ?? {}

	return (
		<div className="grid h-full grid-cols-1 gap-5 md:grid-cols-2">
			<TextInput label="Nombre de Usuario" defaultValue={name} />
			<TextInput label="Email" defaultValue={email} />
			<TextInput label="Teléfono" defaultValue={phone} />
		</div>
	)
}
