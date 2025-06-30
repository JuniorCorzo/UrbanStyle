import type { Products, ProductsGroupedCategory } from '@/interface/product.interface'
import { getAllProducts, getProductsGroupedByCategory } from '@/service/product.service'
import { computed, map } from 'nanostores'

export const productStore = map<Products[]>()

export const productGroupedStore = map<ProductsGroupedCategory[]>()

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
