import { CLOUDFLARE_URL } from '@/config/env-config'
import { productStore } from '@/state/product.store'
import { computed } from 'nanostores'

export const getProductImage = (productId: string) =>
	computed(productStore, (products) => {
		const imageId = products.find(({ id }) => productId === id)?.images[0].image
		return `${CLOUDFLARE_URL}/${imageId}`
	})
