import type { OpenSidebarEvent } from '@/lib/utils/open-modal-event'
import { AddressState } from '@/state/address.state'
import { categoriesStore } from '@/state/categories.store'
import { formStore } from '@/state/form.state'
import { productStore } from '@/state/product.store'
import { useStore } from '@nanostores/react'
import { useEffect, useState, type FormEvent } from 'react'

export function useForm() {
	const [isVisible, setVisible] = useState(false)
	const formState = useStore(formStore)
	const [id, setId] = useState('')

	const products = useStore(productStore)
	const categories = useStore(categoriesStore)

	const handleOpen = () => setVisible(true)
	const handleClose = () => setVisible(false)

	const handleFormConfig = (event: CustomEvent<OpenSidebarEvent>) => {
		const { id: idDocument } = event.detail
		setId(idDocument ?? '')

		handleOpen()
	}

	const getProductValues = () => products.find(({ id: productId }) => productId === id)
	const getCategoryValues = () => categories.find(({ id: categoryId }) => categoryId === id)
	const getAddressValues = () => AddressState.getAddressById(id).get()

	useEffect(() => {
		window.addEventListener('show-sidebar', (e: Event) => {
			handleFormConfig(e as CustomEvent<OpenSidebarEvent>)
		})

		return () => {
			window.removeEventListener('show-sidebar', (e: Event) =>
				handleFormConfig(e as CustomEvent<OpenSidebarEvent>),
			)
		}
	}, [])

	useEffect(() => formStore.setKey('isVisible', isVisible), [isVisible])

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const form = e.currentTarget
		const formData = new FormData(form)

		try {
			if (!formState || typeof formState.sendData !== 'function') return
			formState.sendData(formData, id)
		} catch (error) {
			console.error('Error submitting form:', error)
		}
	}

	return {
		id,
		title: formState?.title,
		formType: formState?.formType,
		getProductValues,
		getCategoryValues,
		getAddressValues,
		isVisible,
		handleOpen,
		handleClose,
		handleSubmit,
	}
}
