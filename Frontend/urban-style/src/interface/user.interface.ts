import type { BaseDocument } from './base.interface'

export type DataConsent = {
	accepted: boolean
	acceptedAt: string
	version: string
}

export interface User extends BaseDocument {
	name: string
	email: string
	role: string
	phone: string
	dataConsent: DataConsent
	avatar?: string
	createdAt?: string
	updatedAt?: string
}

export type CreateUser = Omit<User, 'id' | 'role' | 'dataConsent' | 'createdAt' | 'updateAt'> & {
	password: string
	dataConsent: Pick<DataConsent, 'accepted'>
}

export type UpdateUser = Pick<User, 'id' | 'name' | 'email' | 'phone'>

export interface UserCredentials {
	email: string
	password: string
}

export interface AuthResponse {
	accessToken: string
}
