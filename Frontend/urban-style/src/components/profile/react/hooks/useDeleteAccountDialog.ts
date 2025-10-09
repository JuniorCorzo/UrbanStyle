import { ResponseException } from '@/exceptions/response.exception'
import { $ } from '@/lib/dom-selector'
import { toggleErrorMessage } from '@/lib/showErrorMessages'
import { debounce } from '@/lib/utils/debounce'
import ToasterManager from '@/lib/utils/ToasterManager'
import { UserService } from '@/service/user.service'
import { userStore } from '@/state/user.state'
import { useStore } from '@nanostores/react'
import { navigate } from 'astro:transitions/client'
import { useImperativeHandle, useMemo, useRef, useState, type ChangeEvent } from 'react'
import type { DeleteAccountDialogRef } from '../components/dialog/DeleteAccountDialog'

/**
 * Custom hook to manage the delete account dialog.
 * @param ref - A ref to the dialog component.
 * @returns An object with the dialog ref, password validation status, and event handlers.
 */
export function useDeleteAccountDialog(ref: React.RefObject<DeleteAccountDialogRef | null>) {
	const dialogRef = useRef<HTMLDialogElement>(null)
	const user = useStore(userStore)
	const [isPasswordValid, setPasswordValid] = useState(false)

	const userId = useMemo(() => user?.id, [user])

	useImperativeHandle(ref, () => {
		if (!dialogRef.current) throw new Error('Dialog ref is not assigned')

		return {
			showModal: () => dialogRef.current?.showModal(),
			close: () => dialogRef.current?.close(),
		}
	})

	const verifyPassword = debounce(async (value: string) => {
		if (!userId) return

		const result = await UserService.validatePassword(userId, value)
		if (!result.success) {
			toggleErrorMessage('Lo sentimos, ocurrio un error', $('#password_error') as HTMLSpanElement)
			throw new ResponseException(result.error)
		}

		if (!result.data)
			toggleErrorMessage('Contraseña incorrecta', $('#password_error') as HTMLSpanElement)

		setPasswordValid(result.data)
	}, 300)

	const handleInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value
		if (value.length === 0) return

		await verifyPassword(value)
	}

	const sendRequest = async () => {
		if (!userId) return
		const result = await UserService.deleteUser(userId, 'For request of user')
		if (!result.success) throw new ResponseException(result.error)
		navigate('/home')
	}

	const handleDeleteAccount = () => {
		ToasterManager.emitPromise({
			promise: sendRequest(),
			config: {
				success: 'Usuario eliminado con exito',
				error: 'Ha ocurrido un error, intente mas tarde',
			},
		})
	}

	const handleClose = () => dialogRef.current?.close()

	return {
		dialogRef,
		isPasswordValid,
		handleInputChange,
		handleDeleteAccount,
		handleClose,
	}
}
