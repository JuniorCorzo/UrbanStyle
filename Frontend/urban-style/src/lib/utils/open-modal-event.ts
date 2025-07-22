import type { FormMediator, FormType, SendForm } from '@/interface/form-mediator.interface'

export interface OpenModalEvent extends Omit<FormMediator, 'sendDelete'> {
	id?: string
}

export interface OpenDeleteModal {
	typeModal: string
	sendDelete: (id: string) => void
	id: string
}

export function dispatchShowSidebar(
	title: string,
	formType: FormType,
	sendData: SendForm,
	id?: string,
) {
	window.dispatchEvent(
		new CustomEvent<OpenModalEvent>('show-sidebar', {
			detail: {
				title,
				formType,
				sendData,
				id,
			},
		}),
	)
}

export function openDeleteModalEvent({ typeModal, sendDelete, id }: OpenDeleteModal) {
	window.dispatchEvent(
		new CustomEvent<OpenDeleteModal>('open-delete-modal', {
			detail: {
				typeModal,
				sendDelete,
				id,
			},
		}),
	)
}
