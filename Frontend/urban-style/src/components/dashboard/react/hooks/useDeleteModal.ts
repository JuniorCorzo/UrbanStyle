import type { OpenDeleteModal } from '@/lib/utils/open-modal-event'
import { formStore } from '@/state/form.state'
import { useStore } from '@nanostores/react'
import { useEffect, useRef, useState, type MouseEvent } from 'react'

export function useDeleteModal() {
	const [detailsEvent, setDetailsEvent] = useState<OpenDeleteModal>()
	const dialogRef = useRef<HTMLDialogElement>(null)
	const open = useRef(false)

	const formState = useStore(formStore)

	const handleClose = () => {
		dialogRef.current?.classList.remove('flex')
		open.current = false
	}

	const handleOpen = (event?: CustomEvent<OpenDeleteModal> | MouseEvent<HTMLButtonElement>) => {
		if (open.current) {
			dialogRef.current?.close()
			open.current = false
			return
		}

		if (event instanceof CustomEvent) {
			setDetailsEvent(event?.detail)
		}

		dialogRef.current?.showModal()
		dialogRef.current?.classList.add('flex')
		open.current = true
	}

	const handleSendRequest = () => {
		if (detailsEvent) {
			const { id } = detailsEvent
			formState?.sendDelete(id)
			dialogRef.current?.close()
		}
	}

	useEffect(() => {
		window.addEventListener('open-delete-modal', (event: Event) =>
			handleOpen(event as CustomEvent<OpenDeleteModal>),
		)
		return () => {
			window.removeEventListener('open-delete-modal', (event: Event) =>
				handleOpen(event as CustomEvent<OpenDeleteModal>),
			)
		}
	}, [])

	return {
		title: formState?.title,
		dialogRef,
		handleClose,
		handleOpen,
		handleSendRequest,
	}
}
