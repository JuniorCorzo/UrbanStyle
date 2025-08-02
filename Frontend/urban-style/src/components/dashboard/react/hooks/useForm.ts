import type { OpenSidebarEvent } from '@/lib/utils/open-modal-event'
import { categoriesStore } from '@/state/categories.store'
import { formStore } from '@/state/form.state'
import { productStore } from '@/state/product.store'
import { useStore } from '@nanostores/react'
import { useEffect, useState, type FormEvent } from 'react'

export function useForm() {
	const [visible, setVisible] = useState(false)
	const formState = useStore(formStore)
	const [id, setId] = useState('')
	const products = useStore(productStore)
	const categories = useStore(categoriesStore)

	const handleOpen = () => setVisible((prev) => !prev)

	const handleFormConfig = (event: CustomEvent<OpenSidebarEvent>) => {
		const { id: idDocument } = event.detail
		setId(idDocument ?? '')

		handleOpen()
	}

	const getProductValues = () => products.find(({ id: productId }) => productId === id)
	const getCategoryValues = () => categories.find(({ id: categoryId }) => categoryId === id)

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
		visible,
		handleOpen,
		handleSubmit,
	}
}
