import { extractSingleResponse } from '@/adapter/responses.adapter'
import { PUBLIC_API_URL } from '@/config/env-config'
import type { Cart } from '@/interface/cart.interface'
import type { ErrorMessage, Response } from '@/interface/response.interface'
import type { Result } from '@/lib/result_pattern'
import axios from 'axios'

const getCartByUserId = async (
	userId: string,
	token?: string,
): Promise<Result<Cart, ErrorMessage>> => {
	const headers: Record<string, string> = {
		...(token ? { Authorization: `Bearer ${token}` } : {}),
	}

	const response = await axios.get<Response<Cart>>(
		`${PUBLIC_API_URL}/shopping-cart?user-id=${userId}`,
		{
			withCredentials: true,
			headers,
		},
	)

	return extractSingleResponse(response)
}

const addProductToCart = async (cart: Cart): Promise<Result<Cart, ErrorMessage>> => {
	const response = await axios.post<Response<Cart>>(
		`${PUBLIC_API_URL}/shopping-cart/add-product`,
		cart,
		{
			withCredentials: true,
		},
	)

	return extractSingleResponse(response)
}

const updateQuantityProductInCart = async (
	userId: string,
	productId: string,
	color: string,
	size: string,
	quantity: number,
): Promise<Result<Cart, ErrorMessage>> => {
	const response = await axios.patch<Response<Cart>>(
		`${PUBLIC_API_URL}/shopping-cart/change-quantity?user-id=${userId}&product-id=${productId}&color=${color}&size=${size}&quantity=${quantity}`,
		{},
		{
			withCredentials: true,
		},
	)

	return extractSingleResponse(response)
}

const updateProductInCart = async (cart: Cart): Promise<Result<Cart, ErrorMessage>> => {
	const response = await axios.post<Response<Cart>>(
		`${PUBLIC_API_URL}/shopping-cart/update-product`,
		cart,
		{
			withCredentials: true,
		},
	)

	return extractSingleResponse(response)
}

const removeProductFromCart = async (
	userId: string,
	productId: string,
	color: string,
	size: string,
): Promise<Result<Cart, ErrorMessage>> => {
	const response = await axios.delete(
		`${PUBLIC_API_URL}/shopping-cart/delete-product?user-id=${userId}&product-id=${productId}&color=${color}&size=${size}`,
		{
			withCredentials: true,
		},
	)

	return extractSingleResponse(response)
}

export const CartService = {
	getCartByUserId,
	addProductToCart,
	updateQuantityProductInCart,
	updateProductInCart,
	removeProductFromCart,
}
