import type { ProductSummary } from './product.interface'

export interface Cart {
	userId: string
	items: ProductSummary[]
}
