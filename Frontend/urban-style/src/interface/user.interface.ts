import type { BaseDocument } from './base.interface'

export interface User extends BaseDocument {
	name: string
	email: string
	role: string
	phone: string
}

export interface CreateUser extends Omit<User, 'id' | 'role'> {
	password: string
}

export interface UserCredentials {
	email: string
	password: string
}

export interface AuthResponse {
	accessToken: string
}
