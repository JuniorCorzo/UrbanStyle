import { useFormHandler } from '@/components/react/hooks/useFormHandler'
import { userStore } from '@/state/user.state'
import { useStore } from '@nanostores/react'
import type { UpdateUser } from '@/interface/user.interface'
import { useEffect, useMemo } from 'react'
import { updateUserScheme } from '@/lib/validations/user.validations'
import { UserService } from '@/service/user.service'
import ToasterManager from '@/lib/utils/ToasterManager'
import { ResponseException } from '@/exceptions/response.exception'

const userKeys: (keyof UpdateUser)[] = ['id', 'email', 'name', 'phone'] as const

export function usePersonalData() {
	const user = useStore(userStore) ?? { id: '', name: '', email: '', phone: '' }
	const {
		formState: userValues,
		updateValue,
		handleInputChange,
		canSubmit,
		setSubmit,
	} = useFormHandler<UpdateUser>({
		initializerData: user,
		validate: updateUserScheme,
	})

	const canReset = useMemo(() => {
		if (!user) return false

		return !userKeys.every((key) => userValues.get(key) === user[key])
	}, [userValues])

	const resetUser = (user?: UpdateUser | null) => {
		if (!user) return
		userKeys.map((key) => updateValue(key, user[key]))
		setSubmit(false)
	}

	const sendRequest = () => {
		const { name, email, phone } = userValues.getAll()
		if (!name || !email || !phone) return

		const updateUser: UpdateUser = {
			id: user.id,
			name,
			email,
			phone,
		}

		UserService.updateUser(updateUser).then((response) => {
			if (!response.success) {
				ToasterManager.emitError('Usuario', {
					description: 'Ha ocurrió un error, intente mas tarde',
				})

				throw new ResponseException(response.error)
			}
			userStore.set(response.data)
		})
	}

	useEffect(() => {
		if (!user) {
			console.error('User no found')
			return
		}

		userKeys.map((key) => updateValue(key, user[key]))
	}, [user])

	return {
		user,
		userValues,
		reset: () => resetUser(user),
		updateValue,
		sendRequest,
		handleInputChange,
		userKeys,
		canSubmit,
		canReset,
	}
}
