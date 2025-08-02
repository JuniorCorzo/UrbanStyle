import type { Category } from '@/interface/category.interface'
import type { FormMediator } from '@/interface/form-mediator.interface'
import { createCategory, deleteCategory, updateCategory } from '@/service/categories.service'
import { CategoriesStore } from '@/state/categories.store'
import { CategoryScheme } from '../validations/category.validations'
import { ZodError } from 'zod'
import { showError } from '../showErrorMessages'
import { formStore } from '@/state/form.state'

export async function categoriesForm() {
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

	formStore.set({
		title: 'Nueva categoría',
		formType: 'category',
		sendData,
		sendDelete,
	})
}
