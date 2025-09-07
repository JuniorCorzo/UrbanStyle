import type { Category } from '@/interface/category.interface'
import { CategoryService } from '@/service/categories.service'
import { initializeCategory } from '@/state/categories.store'
import { CategoryScheme } from '../validations/category.validations'
import { ZodError } from 'zod'
import { showError } from '../showErrorMessages'
import { formStore } from '@/state/form.state'
import ToasterManager from '../utils/ToasterManager'
import { ResponseException } from '@/exceptions/response.exception'

export async function categoriesForm() {
	const handleUpdateCategory = async (data: Category) => {
		try {
			CategoryScheme.parse(data)

			const response = await CategoryService.updateCategory(data)
			if (!response.success) throw new ResponseException(response.error)

			await initializeCategory()
		} catch (err) {
			if (err instanceof ZodError) {
				showError(err)
			}
			throw err
		}
	}

	const handleCreateCategory = async (data: Category) => {
		try {
			CategoryScheme.parse(data)

			const response = await CategoryService.createCategory(data)
			if (!response.success) throw new ResponseException(response.error)

			await initializeCategory()
		} catch (err) {
			if (err instanceof ZodError) {
				showError(err)
			}
			throw err
		}
	}

	const handleDeleteCategory = async (id: string) => {
		const response = await CategoryService.deleteCategory(id)
		if (!response.success) throw new ResponseException(response.error)

		await initializeCategory()
	}

	const sendData = async (formData?: FormData) => {
		if (!formData) return

		const categoryData = Object.fromEntries(formData.entries()) as unknown as Category

		if (categoryData.id) {
			ToasterManager.emitPromise({
				promise: handleUpdateCategory(categoryData),
				config: {
					success: 'Se ha actualizado la categoría con éxito',
					error: 'Ha ocurrió un error actualizando la categoría',
				},
			})
			return
		}

		ToasterManager.emitPromise({
			promise: handleCreateCategory(categoryData),
			config: {
				success: 'La categoría se ha creado con éxito',
				error: 'Ha ocurrió un error creando la categoría',
			},
		})
	}

	const sendDelete = (id: string) => {
		ToasterManager.emitPromise({
			promise: handleDeleteCategory(id),
			config: {
				success: 'Se ha eliminado la categoría con éxito',
				error: 'Ha ocurrió un error eliminando la categoría, intente mas tarde',
			},
		})
	}

	formStore.set({
		isVisible: false,
		title: 'Nueva categoría',
		formType: 'category',
		sendData,
		sendDelete,
	})
}
