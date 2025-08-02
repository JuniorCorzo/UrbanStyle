import type { Products, ProductsGroupedCategory } from '@/interface/product.interface'
import type { ProductReport } from '@/interface/report.interface'
import { getAllProducts, getProductsGroupedByCategory } from '@/service/product.service'
import { ReportService } from '@/service/report.service'
import { atom, computed, map, onMount } from 'nanostores'

export const productStore = map<Products[]>([])
export const productReportStore = atom<ProductReport[]>([])

onMount(productReportStore, () => {
	ReportService()
		.productsReport()
		.then((report) => productReportStore.set(report))
})

export const productGroupedStore = map<ProductsGroupedCategory[]>([])

export async function initializeProductGroupeStore() {
	const products = await getProductsGroupedByCategory()
	productGroupedStore.set(products)
}

export async function ProductStore() {
	if (!productStore.get().length) {
		const products = await getAllProducts()
		productStore.set(products)
	}

	const productStoreUpdate = async () => {
		const products = await getAllProducts()
		productStore.set(products)
	}

	const getProductById = (productId: string) => {
		const product = computed(productStore, (products) =>
			products.find((product) => product.id === productId),
		)

		return product
	}

	return { productStore, productStoreUpdate, getProductById }
}
