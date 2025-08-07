import { PUBLIC_API_URL } from '@/config/env-config'
import type { Response } from '@/interface/response.interface'
import type { CreateUser, User } from '@/interface/user.interface'
import axios from 'axios'

export class UserService {
	public static async getUserById(userId: string) {
		return await axios
			.get<User>(`${PUBLIC_API_URL}/users?user-id=${userId}`, {
				headers: {
					'Content-Type': 'application/json',
				},
				withCredentials: true,
			})
			.then((response) => {
				return (response.data as unknown as Response<User>).data[0]
			})
			.catch((error) => {
				console.error('Error fetching user by ID:', error)
				throw error
			})
	}

	static async validatePassword(userId: string, password: string): Promise<boolean> {
		return (
			await axios
				.get<
					Response<boolean>
				>(`${PUBLIC_API_URL}/users/verify-password?user-id=${userId}&password=${password}`, { withCredentials: true })
				.then((response) => {
					if (response.status !== 200) throw Error('Unexpected error')
					return response.data
				})
		).data[0]
	}

	public static async signUp(createUser: CreateUser) {
		const responseRequest: User = await axios
			.post(`${PUBLIC_API_URL}/users/create`, createUser, {
				withCredentials: true,
			})
			.then((response) => {
				return (response.data as Response<User>).data[0]
			})

		return responseRequest
	}
}
