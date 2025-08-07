import { showError } from '@/lib/showErrorMessages'
import { debounce } from '@/lib/utils/debounce'
import {
	changePasswordScheme,
	type ChangePasswordValid,
} from '@/lib/validations/user.validations'
import { UserService } from '@/service/user.service'
import { userStore } from '@/state/user.state'
import { useStore } from '@nanostores/react'
import { useReducer, useState, useCallback, type ChangeEvent } from 'react'
import type { ZodError } from 'zod'

type ChangePassword = {
	oldPassword: string
	newPassword: string
	confirmPassword: string
}

type ActionsType = 'UPDATE_VALUE'
type Payload = {
	key: keyof ChangePassword
	value: string
}

type Actions = {
	type: ActionsType
	payload: Payload
}

const reducer = (state: Map<keyof ChangePassword, string>, actions: Actions) => {
	const { type, payload } = actions
	const { key, value } = payload
	switch (type) {
		case 'UPDATE_VALUE':
			state.set(key, value)

			return state
	}

	return state
}

const handleError = (error: ZodError, key: keyof ChangePassword) => {
	const errorPath = error.errors.find((err) => err.path.includes(key))
	if (errorPath) {
		showError(errorPath)
	}
}

export const useChangePassword = () => {
	const user = useStore(userStore)
	const [isPassword, setPassword] = useState<boolean>()
	const [passwordValues, dispatch] = useReducer(reducer, new Map())

	const validateField = (key: keyof ChangePassword) => {
		const data: ChangePasswordValid = {
			oldPassword: passwordValues.get('oldPassword'),
			newPassword: passwordValues.get('newPassword'),
			confirmPassword: passwordValues.get('confirmPassword'),
		}
		const isValid = changePasswordScheme.safeParse(data)

		if (isValid.error) {
			handleError(isValid.error, key)
		}
	}

	const debouncedValidate = useCallback(debounce(validateField, 500), [])

	const handleChange = (event: ChangeEvent<HTMLInputElement>, key: keyof ChangePassword) => {
		dispatch({ type: 'UPDATE_VALUE', payload: { key, value: event.target.value } })
		debouncedValidate(key)
	}

	const handleValidatePassword = () => {
		UserService.validatePassword(user?.id ?? '', passwordValues.get('oldPassword')).then(
			(response) => setPassword(response),
		)
	}

	return {
		isPassword,
		handleChange,
		handleValidatePassword,
	}
}
