import type { StringifyOptions } from 'querystring'
import type { BaseDocument } from './base.interface'

export interface User extends BaseDocument {
	name: string
	email: string
	role: string
	phone: string
	avatar?: string
	createdAt?: string
	updatedAt?: string
}

export interface CreateUser extends Omit<User, 'id' | 'role' | 'createdAt' | 'updateAt'> {
	password: string
}

export interface UserCredentials {
	email: string
	password: string
}

export interface AuthResponse {
	accessToken: string
}
