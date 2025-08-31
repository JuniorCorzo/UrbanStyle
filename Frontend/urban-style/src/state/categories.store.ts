import { ResponseException } from '@/exceptions/response.exception'
import type { Category } from '@/interface/category.interface'
import type { CategoryReport } from '@/interface/report.interface'
import { CategoryService } from '@/service/categories.service'
import { ReportService } from '@/service/report.service'
import { atom, map, onMount } from 'nanostores'

export const categoryReportStore = atom<CategoryReport[]>([])
onMount(categoryReportStore, () => {
	ReportService.categoryReport().then((response) => {
		if (!response.success) throw new ResponseException(response.error)
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
		throw new ResponseException(response.error)
	}

	categoriesStore.set(response.data)
}
