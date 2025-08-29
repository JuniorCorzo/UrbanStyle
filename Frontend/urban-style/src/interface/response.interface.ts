interface ResponseBase {
	status: string
	timestamp: string
}

export type Response<T = []> = ResponseBase & {
	data: T[]
	message: string
}

export type ErrorMessage = string | Record<string, string>[]
export type ResponseError = ResponseBase & {
	error: string
	errors: Record<string, string>[]
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
