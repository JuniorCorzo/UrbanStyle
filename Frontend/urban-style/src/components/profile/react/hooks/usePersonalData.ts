import { useMapReducer } from '@/components/react/hooks/useMapReducer'
import { userStore } from '@/state/user.state'
import { useStore } from '@nanostores/react'
import type { UpdateUser } from '@/interface/user.interface'
import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react'
import { debounce } from '@/lib/utils/debounce'
import { updateUserScheme, type UpdateUserValid } from '@/lib/validations/user.validations'
import { showErrorOnlyField } from '@/lib/showErrorMessages'
import { UserService } from '@/service/user.service'

const userKeys: (keyof UpdateUser)[] = ['id', 'email', 'name', 'phone'] as const

export function usePersonalData() {
	const user = useStore(userStore) ?? { id: '', name: '', email: '', phone: '' }
	const { formState: userValues, updateValue } = useMapReducer<UpdateUser>()
	const [canSubmit, setCanSubmit] = useState(false)

	const canReset = useMemo(() => {
		if (!user) return false

		return !userKeys.every((key) => userValues.get(key) === user[key])
	}, [userValues])

	const resetUser = (user?: UpdateUser | null) => {
		if (!user) return
		userKeys.map((key) => updateValue(key, user[key]))
		setCanSubmit(false)
	}

	const validateField = (key: keyof UpdateUser, value: string) => {
		const userData: Partial<UpdateUserValid> = {
			name: userValues.get('name'),
			email: userValues.get('email'),
			phone: userValues.get('phone'),
			[key]: value,
		}
		const userIsValid = updateUserScheme.safeParse(userData)

		if (userIsValid.error) showErrorOnlyField(userIsValid.error, key)
		setCanSubmit(userIsValid.success && canReset)
	}

	const sendRequest = () => {
		const name = userValues.get('name')
		const email = userValues.get('email')
		const phone = userValues.get('phone')
		if (!name || !email || !phone) return

		const updateUser: UpdateUser = {
			id: user.id,
			name,
			email,
			phone,
		}

		UserService.updateUser(updateUser).then(({ data, message }) => {
			userStore.set(data[0])
			console.log(message)
		})
	}

	const debounceValid = useCallback(debounce(validateField, 350), [userValues])

	const handleChange = (event: ChangeEvent<HTMLInputElement>, key: keyof UpdateUser) => {
		const value = event.target.value

		updateValue(key, event.target.value)
		debounceValid(key, value)
	}

	console.log(canSubmit)

	useEffect(() => {
		userStore.listen((user) => {
			if (user) resetUser(user)
		})
	}, [])

	return {
		user,
		userValues,
		reset: () => resetUser(user),
		updateValue,
		sendRequest,
		handleChange,
		userKeys,
		canSubmit,
		canReset,
	}
}
