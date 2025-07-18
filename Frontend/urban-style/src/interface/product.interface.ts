import type { BaseDocument } from './base.interface'
import type { CategorySummary } from './category.interface'

export type Attributes = {
	color: string
	size: string
	quantity: number
}

export type Images = {
	color: string
	image: string
}

export interface Products extends BaseDocument {
	name: string
	description: string
	price: number
	images: Images[]
	categories: CategorySummary[]
	attributes: Attributes[]
	stock: number
	discount?: number
}

export interface ProductsGroupedCategory {
	category: string
	products: Products[]
}

export interface ProductSummary extends Pick<Products, 'name' | 'price' | 'discount'> {
	productId: Products['id']
	color: string
	size: string
	quantity: number
}

export interface DeleteImageProduct {
	productId: string
	images: string[]
}

export interface AddImageProduct {
	productId: string
	images: Images[]
}

export interface CreateProduct extends Omit<Products, 'id' | 'stock'> {}
export interface UpdateProduct extends Omit<Products, 'stock' | 'images'> {}
