export interface Response<T = []> {
	status: string
	data: T[]
	message: string
}

export type Page = {
	size: number
	number: number
	totalElements: number
	totalPages: number
}

export type Pagination<T = []> = {
	content: T
	page: Page
}
