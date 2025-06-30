import type { AuthResponse, User, UserCredentials } from '@/interface/user.interface'
import type { Response } from '@/interface/response.interface'
import axios from 'axios'
import { PUBLIC_API_URL } from '@/config/env-config'

export const AuthRequest = async (userCredentials: UserCredentials) => {
	return await axios
		.post<AuthResponse>(`${PUBLIC_API_URL}/auth/login`, userCredentials, {
			withCredentials: true,
			headers: {
				'Content-Type': 'application/json',
			},
		})
		.then((response) => {
			return response
		})
		.catch((error) => {
			console.error('Authentication error:', error)
			throw error
		})
}

export const verifyToken = async (cookie: string) => {
	return await axios
		.get<User>(`${PUBLIC_API_URL}/auth/verify`, {
			withCredentials: true,
			headers: {
				'Content-Type': 'application/json',
				Cookie: cookie,
			},
		})
		.then((response) => {
			return (response.data as unknown as Response<User>).data[0]
		})
		.catch((error) => {
			console.error('Token verification error:', error)
			throw error
		})
}

export const logout = async () => {
	return await axios
		.delete(`${PUBLIC_API_URL}/auth/sign-out`, {
			withCredentials: true,
			headers: {
				'Content-Type': 'application/json',
			},
		})
		.then((response) => {
			return response.data as Response<User>
		})
		.catch((error) => {
			console.error('Logout error:', error)
			throw error
		})
}
