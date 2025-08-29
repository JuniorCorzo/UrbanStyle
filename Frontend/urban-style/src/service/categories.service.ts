import { extractResponse, extractSingleResponse, obtainsError } from '@/adapter/responses.adapter'
import { PUBLIC_API_URL } from '@/config/env-config'
import type { Category, CreateCategory } from '@/interface/category.interface'
import type { ErrorMessage, Response } from '@/interface/response.interface'
import { Err, Success, type Result } from '@/lib/result_pattern'
import axios from 'axios'

async function getDescriptionByName(categoryName: string): Promise<Result<string, ErrorMessage>> {
	const response = await axios.get<Response<string>>(
		`${PUBLIC_API_URL}/categories/description?name=${categoryName}`,
	)

	return extractSingleResponse(response)
}

async function getAllCategories(): Promise<Result<Category[], ErrorMessage>> {
	const response = await axios.get<Response<Category>>(`${PUBLIC_API_URL}/categories/all`)

	return extractResponse(response)
}

async function createCategory(category: CreateCategory): Promise<Result<Category, ErrorMessage>> {
	const response = await axios.post<Response<Category>>(
		`${PUBLIC_API_URL}/categories/create`,
		category,
		{
			withCredentials: true,
		},
	)

	return extractSingleResponse(response, 201)
}

async function updateCategory(category: Category): Promise<Result<Category, ErrorMessage>> {
	const response = await axios.put<Response<Category>>(
		`${PUBLIC_API_URL}/categories/update`,
		category,
		{
			withCredentials: true,
		},
	)

	return extractSingleResponse(response)
}

async function deleteCategory(categoryId: string): Promise<Result<string, ErrorMessage>> {
	const response = await axios.delete<Response<never>>(
		`${PUBLIC_API_URL}/categories/delete/${categoryId}`,
		{
			withCredentials: true,
		},
	)
	const { status, data: responseData } = response
	if (status !== 200) {
		const { message } = obtainsError(response)
		return Err(message)
	}

	return Success(responseData.message)
}

export const CategoryService = {
	getAllCategories,
	getDescriptionByName,
	createCategory,
	updateCategory,
	deleteCategory,
}
