import type { BaseDocument } from './base.interface'
import type { CategorySummary } from './category.interface'
import type { StockMovements } from './stock_movements.interface'

export type Attribute = {
	sku: string
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
	attributes: Attribute[]
	stock: number
	discount?: number
}

export interface ProductsGroupedCategory {
	category: string
	products: Products[]
}

export interface ProductSummary extends Pick<Products, 'name' | 'price' | 'discount'> {
	productId: Products['id']
	sku: string
	color: string
	size: string
	quantity: number
}

export interface DeleteImageProduct {
	productId: string
	images: string[]
}

export interface ProductImages {
	productId: string
	images: Images[]
}

export interface CreateProduct extends Omit<Products, 'id' | 'stock'> {}
export interface UpdateProduct extends Omit<Products, 'stock' | 'images'> {}

export type ProductInventory = {
	productId: string
	product: string
	sku: string
	stock: number
	movements: StockMovements[]
}
