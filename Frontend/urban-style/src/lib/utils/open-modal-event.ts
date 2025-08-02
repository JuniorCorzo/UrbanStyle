export interface OpenSidebarEvent {
	id?: string
}

export interface OpenDeleteModal {
	id: string
}

export function dispatchShowSidebar(id?: string) {
	window.dispatchEvent(
		new CustomEvent<OpenSidebarEvent>('show-sidebar', {
			detail: {
				id,
			},
		}),
	)
}

export function dispatchDeleteModal({ id }: OpenDeleteModal) {
	window.dispatchEvent(
		new CustomEvent<OpenDeleteModal>('open-delete-modal', {
			detail: {
				id,
			},
		}),
	)
}
