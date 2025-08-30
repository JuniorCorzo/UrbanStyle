import { showErrorOnlyField } from '@/lib/showErrorMessages'
import { debounce } from '@/lib/utils/debounce'
import { changePasswordScheme, type ChangePasswordValid } from '@/lib/validations/user.validations'
import { UserService } from '@/service/user.service'
import { userStore } from '@/state/user.state'
import { useStore } from '@nanostores/react'
import { useState, useCallback, type ChangeEvent, useRef } from 'react'
import { useMapReducer } from '@/components/react/hooks/useMapReducer'
import ToasterManager from '@/lib/utils/ToasterManager'

type ChangePassword = {
	oldPassword: string
	newPassword: string
	confirmPassword: string
}

export const useChangePassword = () => {
	const user = useStore(userStore)
	const [isPassword, setPassword] = useState<boolean>()
	const { formState: passwordValues, updateValue } = useMapReducer<ChangePassword>()
	const canSubmit = useRef<boolean>(false)

	const validateField = useCallback(
		(key: keyof ChangePassword, value: string) => {
			const data: Partial<ChangePasswordValid> = {
				oldPassword: passwordValues.get('oldPassword'),
				newPassword: passwordValues.get('newPassword'),
				confirmPassword: passwordValues.get('confirmPassword'),
				[key]: value,
			}

			const isValid = changePasswordScheme.safeParse(data)

			canSubmit.current = isValid.success
			if (isValid.error) showErrorOnlyField<ChangePassword>(isValid.error, key)
		},
		[passwordValues],
	)

	const handleChange = debounce(
		(event: ChangeEvent<HTMLInputElement>, key: keyof ChangePassword) => {
			const value = event.target.value
			updateValue(key, value)
			validateField(key, value)
		},
		300,
	)

	const handleChangePassword = (userId: string, oldPassword: string, newPassword: string) =>
		UserService.changePassword(userId, oldPassword, newPassword).then((response) => {
			if (!response.success) throw new Error(response.error.toString())
			console.log(response.data)
		})

	const sendRequest = () => {
		const oldPassword = passwordValues.get('oldPassword')
		const newPassword = passwordValues.get('newPassword')
		if (!user?.id || !oldPassword || !newPassword) return

		ToasterManager.emitPromise({
			promise: handleChangePassword(user.id, oldPassword, newPassword),
			config: {
				success: 'Se ha cambiado la contraseña con éxito',
				error: 'Ha ocurrió un error, vuelve a intentar mas tarde',
			},
		})
	}

	const handleValidatePassword = () => {
		const userId = user?.id
		const oldPassword = passwordValues.get('oldPassword')
		if (!userId || !oldPassword) return

		UserService.validatePassword(userId, oldPassword).then((response) => {
			if (!response.success) {
				ToasterManager.emitError('Usuario', {
					description: 'Ha ocurrió un error, intente mas tarde',
				})

				throw new Error(response.error.toString())
			}
			setPassword(response.data)
		})
	}

	return {
		isPassword,
		handleChange,
		handleValidatePassword,
		canSubmit: canSubmit.current,
		sendRequest,
	}
}
