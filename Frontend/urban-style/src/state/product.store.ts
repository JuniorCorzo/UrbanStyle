import type { Products, ProductsGroupedCategory } from '@/interface/product.interface'
import type { ProductReport } from '@/interface/report.interface'
import { ProductService } from '@/service/product.service'
import { ReportService } from '@/service/report.service'
import { atom, computed, map, onMount } from 'nanostores'

export const productStore = map<Products[]>([])

onMount(productStore, () => {
	initializeProducts()
})

export const initializeProducts = async () => {
	const response = await ProductService.getAllProducts()

	if (!response.success) throw Error(response.error.toString())
	productStore.set(response.data)
}

export const productReportStore = atom<ProductReport[]>([])
onMount(productReportStore, () => {
	initializeReportProducts()
})
export const initializeReportProducts = () =>
	ReportService.productsReport().then((response) => {
		if (!response.success) throw new Error(response.error.toString())

		productReportStore.set(response.data)
	})

export const productGroupedStore = map<ProductsGroupedCategory[]>([])
export async function initializeProductGroupeStore() {
	const response = await ProductService.getProductsGroupedByCategory()
	if (!response.success) throw Error(response.error.toString())

	productGroupedStore.set(response.data)
}

export function ProductStore() {
	const getProductById = (productId: string) =>
		computed(productStore, (products) => products.find((product) => product.id === productId))

	return { getProductById }
}
