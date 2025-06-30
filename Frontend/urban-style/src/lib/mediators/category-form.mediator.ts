import type { Category } from '@/interface/category.interface'
import type { FormMediator } from '@/interface/form-mediator.interface'
import { createCategory, deleteCategory, updateCategory } from '@/service/categories.service'
import { CategoriesStore } from '@/state/categories.store'
import { CategoryScheme } from '../validations/category.validations'
import { ZodError } from 'zod'
import { showError } from '../showErrorMessages'

export async function categoriesForm(id?: string): Promise<FormMediator> {
	const sendData = async (formData?: FormData) => {
		if (!formData) return

		const categoryData = Object.fromEntries(formData.entries()) as unknown as Category

		try {
			CategoryScheme.parse(categoryData)

			if (categoryData.id) {
				await updateCategory(categoryData)
				;(await CategoriesStore()).categoriesStoreUpdate()
				return
			}

			createCategory(categoryData)
			;(await CategoriesStore()).categoriesStoreUpdate()
		} catch (err) {
			if (err instanceof ZodError) {
				showError(err)
			}
		}
	}

	const sendDelete = (id: string) => {
		deleteCategory(id)
	}

	return {
		title: 'Nueva categoría',
		formType: 'category',
		sendData,
		sendDelete,
	}
}
