import type { AuthResponse, User, UserCredentials } from '@/interface/user.interface'
import type { ErrorMessage, Response } from '@/interface/response.interface'
import axios from 'axios'
import { PUBLIC_API_URL } from '@/config/env-config'
import { Err, Success, type Result } from '@/lib/result_pattern'
import { extractSingleResponse, obtainsError } from '@/adapter/responses.adapter'

const login = async (
	userCredentials: UserCredentials,
): Promise<Result<AuthResponse, ErrorMessage>> => {
	const response = await axios.post<AuthResponse>(`${PUBLIC_API_URL}/auth/login`, userCredentials, {
		withCredentials: true,
		headers: {
			'Content-Type': 'application/json',
		},
	})
	const { status, data: responseData } = response

	if (status !== 200) {
		const { message } = obtainsError(response)
		return Err(message)
	}

	return Success(responseData)
}

const verifyToken = async (cookie?: string): Promise<Result<User, ErrorMessage>> => {
	const response = await axios.get<Response<User>>(`${PUBLIC_API_URL}/auth/verify`, {
		withCredentials: true,
		headers: {
			'Content-Type': 'application/json',
			Cookie: cookie,
		},
		validateStatus: () => true,
	})
	return extractSingleResponse(response)
}

const logout = async (): Promise<Result<string, ErrorMessage>> => {
	const response = await axios.delete<Response<never>>(`${PUBLIC_API_URL}/auth/sign-out`, {
		withCredentials: true,
		headers: {
			'Content-Type': 'application/json',
		},
	})

	const { status, data: responseData } = response

	if (status !== 200) {
		const { message } = obtainsError(response)
		return Err(message)
	}

	return Success(responseData.message)
}

export const AuthService = {
	verifyToken,
	logout,
	login,
}
