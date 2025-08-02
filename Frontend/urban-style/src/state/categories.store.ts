import type { Category } from '@/interface/category.interface'
import type { CategoryReport } from '@/interface/report.interface'
import { getAllCategories } from '@/service/categories.service'
import { ReportService } from '@/service/report.service'
import { atom, map, onMount } from 'nanostores'

export const categoryReportStore = atom<CategoryReport[]>([])
onMount(categoryReportStore, () => {
	ReportService()
		.categoryReport()
		.then((report) => categoryReportStore.set(report))
})

export const categoriesStore = map<Category[]>([])

export async function CategoriesStore() {
	if (!categoriesStore.get().length) {
		const categories = await getAllCategories()
		categoriesStore.set(categories)
	}

	const categoriesStoreUpdate = async () => {
		const categories = await getAllCategories()
		categoriesStore.set(categories)
	}

	return { categoriesStore, categoriesStoreUpdate }
}
