import type { Category } from '@/interface/category.interface'
import type { CategoryReport } from '@/interface/report.interface'
import { CategoryService } from '@/service/categories.service'
import { ReportService } from '@/service/report.service'
import { atom, map, onMount } from 'nanostores'

export const categoryReportStore = atom<CategoryReport[]>([])
onMount(categoryReportStore, () => {
	ReportService.categoryReport().then((response) => {
		if (!response.success) throw new Error(response.error.toString())
		categoryReportStore.set(response.data)
	})
})

export const categoriesStore = map<Category[]>([])
onMount(categoriesStore, () => {
	initializeCategory()
})

export const initializeCategory = async () => {
	const response = await CategoryService.getAllCategories()

	if (!response.success) {
		throw Error(response.error.toString())
	}

	categoriesStore.set(response.data)
}
