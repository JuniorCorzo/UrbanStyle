import axios from 'axios'
import type {
	ProductImages,
	CreateProduct,
	Products,
	ProductsGroupedCategory,
	UpdateProduct,
	ProductInventory,
} from '@/interface/product.interface'
import type { ErrorMessage, Response } from '@/interface/response.interface'
import { PUBLIC_API_URL } from '@/config/env-config'
import { Err, Success, type Result } from '@/lib/result_pattern'
import { extractResponse, extractSingleResponse, obtainsError } from '@/adapter/responses.adapter'

const getAllProducts = async (): Promise<Result<Products[], ErrorMessage>> => {
	const { status, data: response } = await axios.get<Response<Products>>(
		`${PUBLIC_API_URL}/products/all`,
	)

	if (status !== 200) {
		const { message } = obtainsError(response)
		return Err(message)
	}

	return Success(response.data)
}

async function getProductsGroupedByCategory(): Promise<
	Result<ProductsGroupedCategory[], ErrorMessage>
> {
	const response = await axios.get<Response<ProductsGroupedCategory>>(
		`${PUBLIC_API_URL}/products/group`,
	)

	return extractResponse(response)
}

const getProductById = async (productId: string): Promise<Result<Products, ErrorMessage>> => {
	const response = await axios.get<Response<Products>>(`${PUBLIC_API_URL}/products?id=${productId}`)

	return extractSingleResponse(response)
}

const getProductsByCategory = async (
	categoryName: string,
): Promise<Result<Products[], ErrorMessage>> => {
	const response = await axios.get<Response<Products>>(`${PUBLIC_API_URL}/products/${categoryName}`)

	return extractResponse(response)
}

const searchProducts = async (searchQuery: string): Promise<Result<Products[], ErrorMessage>> => {
	const response = await axios.get(`${PUBLIC_API_URL}/products/search?search=${searchQuery}`)

	return extractResponse(response)
}

const getProductsInventory = async (): Promise<Result<ProductInventory[], ErrorMessage>> => {
	const response = await axios.get<Response<ProductInventory>>(
		`${PUBLIC_API_URL}/products/inventory`,
		{
			withCredentials: true,
		},
	)

	return extractResponse(response)
}

const createProduct = async (product: CreateProduct): Promise<Result<Products, ErrorMessage>> => {
	const response = await axios.post<Response<Products>>(
		`${PUBLIC_API_URL}/products/create`,
		product,
		{
			withCredentials: true,
		},
	)

	return extractSingleResponse(response)
}

const addImageToProduct = async (
	addImage: ProductImages,
): Promise<Result<Products, ErrorMessage>> => {
	const response = await axios.post<Response<Products>>(
		`${PUBLIC_API_URL}/products/add-images`,
		addImage,
		{
			withCredentials: true,
		},
	)

	return extractSingleResponse(response)
}

const deleteImageToProduct = async (
	deleteImage: ProductImages,
): Promise<Result<Products, ErrorMessage>> => {
	const response = await axios.delete(`${PUBLIC_API_URL}/products/delete-images`, {
		withCredentials: true,
		data: deleteImage,
	})

	return extractSingleResponse(response)
}

const updateProduct = async (product: UpdateProduct): Promise<Result<Products, ErrorMessage>> => {
	const response = await axios.put(`${PUBLIC_API_URL}/products/update`, product, {
		withCredentials: true,
	})

	return extractSingleResponse(response)
}

const deleteProduct = async (productId: string): Promise<Result<string, ErrorMessage>> => {
	const response = await axios.delete<Response>(`${PUBLIC_API_URL}/products/delete/${productId}`, {
		withCredentials: true,
	})

	if (response.status !== 200) {
		const { message } = obtainsError(response)
		return Err(message)
	}

	return Success(response.data.message)
}

export const ProductService = {
	getAllProducts,
	getProductById,
	getProductsByCategory,
	getProductsGroupedByCategory,
	getProductsInventory,
	searchProducts,
	addImageToProduct,
	deleteImageToProduct,
	createProduct,
	updateProduct,
	deleteProduct,
}
