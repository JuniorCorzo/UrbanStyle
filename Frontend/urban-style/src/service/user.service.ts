import { extractSingleResponse, obtainsError } from '@/adapter/responses.adapter'
import { PUBLIC_API_URL } from '@/config/env-config'
import type { ErrorMessage, Response } from '@/interface/response.interface'
import type { CreateUser, UpdateUser, User } from '@/interface/user.interface'
import { Err, Success, type Result } from '@/lib/result_pattern'
import axios from 'axios'

async function getUserById(userId: string): Promise<Result<User, ErrorMessage>> {
	const response = await axios.get<Response<User>>(`${PUBLIC_API_URL}/users?user-id=${userId}`, {
		headers: {
			'Content-Type': 'application/json',
		},
		withCredentials: true,
	})

	return extractSingleResponse(response)
}

async function validatePassword(
	userId: string,
	password: string,
): Promise<Result<boolean, ErrorMessage>> {
	const response = await axios.get<Response<boolean>>(
		`${PUBLIC_API_URL}/users/verify-password?user-id=${userId}&password=${password}`,
		{ withCredentials: true },
	)

	return extractSingleResponse(response)
}

async function signUp(createUser: CreateUser): Promise<Result<User, ErrorMessage>> {
	const responseRequest = await axios.post<Response<User>>(
		`${PUBLIC_API_URL}/users/create`,
		createUser,
		{
			withCredentials: true,
			validateStatus: () => true,
		},
	)

	return extractSingleResponse(responseRequest)
}

async function updateUser(user: UpdateUser): Promise<Result<User, ErrorMessage>> {
	const response = await axios.put<Response<User>>(
		`${PUBLIC_API_URL}/users/update?user-id=${user.id}`,
		user,
		{
			withCredentials: true,
		},
	)

	return extractSingleResponse(response)
}

async function updateUserConsent(userId: string) {
	const response = await axios.patch<Response<User>>(
		`${PUBLIC_API_URL}/users/update-consent?user-id=${userId}`,
		null,
		{
			withCredentials: true,
		},
	)

	return extractSingleResponse(response)
}

async function changeAvatar(
	userId: string,
	avatarBase64: string,
): Promise<Result<string, ErrorMessage>> {
	const response = await axios.patch<Response>(
		`${PUBLIC_API_URL}/users/change-avatar?user-id=${userId}`,
		{
			userId,
			avatar: avatarBase64,
		},
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

async function changePassword(
	userId: string,
	oldPassword: string,
	newPassword: string,
): Promise<Result<string, ErrorMessage>> {
	const response = await axios.patch<Response>(
		`${PUBLIC_API_URL}/users/change-password?user-id=${userId}&old-password=${oldPassword}&new-password=${newPassword}`,
		null,
		{ withCredentials: true },
	)
	const { status, data: responseData } = response
	if (status !== 200) {
		const { message } = obtainsError(response)
		return Err(message)
	}

	return Success(responseData.message)
}

/**
 * Deletes a user account.
 * @param userId - The ID of the user to delete.
 * @param reason - The reason for deleting the account.
 * @returns A promise that resolves with a success message or an error message.
 * @throws {ResponseException} If the request fails.
 */
async function deleteUser(userId: string, reason: string): Promise<Result<string, ErrorMessage>> {
	const response = await axios.delete<Response<never>>(
		`${PUBLIC_API_URL}/users/delete?user-id=${userId}&reason=${reason}`,
		{ withCredentials: true },
	)
	const { status, data: responseData } = response

	if (status !== 200) {
		const { message } = obtainsError(response)
		return Err(message)
	}

	return Success(responseData.message)
}

async function deleteAvatar(userId: string): Promise<Result<string, ErrorMessage>> {
	const response = await axios.delete<Response<never>>(
		`${PUBLIC_API_URL}/users/delete-avatar?user-id=${userId}`,
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

export const UserService = {
	getUserById,
	signUp,
	updateUser,
	updateUserConsent,
	validatePassword,
	changePassword,
	changeAvatar,
	deleteUser,
	deleteAvatar,
}
