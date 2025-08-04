import { PUBLIC_API_URL } from '@/config/env-config'
import type { Category, CreateCategory } from '@/interface/category.interface'
import type { Response } from '@/interface/response.interface'
import axios from 'axios'

export async function getDescriptionByName(categoryName: string) {
	return (
		await axios
			.get<Response<string>>(`${PUBLIC_API_URL}/categories/description?name=${categoryName}`)
			.then((response) => {
				if (response.status !== 200) throw Error()
				return response.data
			})
	).data[0]
}

export async function getAllCategories() {
	const response = await axios.get(`${PUBLIC_API_URL}/categories/all`).then((response) => {
		return response.data as Response<Category>
	})

	return response.data
}

export async function createCategory(category: CreateCategory) {
	const response = await axios
		.post(`${PUBLIC_API_URL}/categories/create`, category, {
			withCredentials: true,
		})
		.then((response) => {
			return response.data as Response<Category>
		})

	return response.data
}
export async function updateCategory(category: Category) {
	const response = await axios
		.put(`${PUBLIC_API_URL}/categories/update`, category, {
			withCredentials: true,
		})
		.then((response) => {
			return response.data as Response<Category>
		})

	return response.data
}
export async function deleteCategory(categoryId: string) {
	const response = await axios
		.delete(`${PUBLIC_API_URL}/categories/delete/${categoryId}`, {
			withCredentials: true,
		})
		.then((response) => {
			return response.data as Response<Category>
		})

	return response.data
}

export default {
	getAllCategories,
	getDescriptionByName,
	createCategory,
	updateCategory,
	deleteCategory,
}
