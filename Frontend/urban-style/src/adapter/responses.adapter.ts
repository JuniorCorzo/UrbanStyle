import type { ResponseError, ErrorMessage, Response } from '@/interface/response.interface'
import { Err, Success, type Result } from '@/lib/result_pattern'
import type { AxiosResponse } from 'axios'

function checkResponseError(responseError: unknown): responseError is ResponseError {
	return typeof responseError === 'string' || typeof responseError === 'object'
}

export function obtainsError<T>(response: AxiosResponse<Response<T>, any>): {
	message: ErrorMessage
	responseError?: ResponseError
} {
	const errorResponse = response.data
	if (!checkResponseError(errorResponse)) {
		return {
			message: 'Unexpected error',
		}
	}

	const responseError = errorResponse
	const { error, errors } = responseError
	console.log(responseError)

	return {
		message: error ? error : errors,
		responseError,
	}
}

export function extractResponse<T>(
	response: AxiosResponse<Response<T>, any>,
	statusResponse: number = 200,
): Result<T[], ErrorMessage> {
	const { status, data: responseData } = response
	if (status !== statusResponse) {
		const { message } = obtainsError(response)
		return Err(message)
	}

	return Success(responseData.data)
}

export function extractSingleResponse<T>(
	response: AxiosResponse<Response<T>, any>,
	statusResponse: number = 200,
): Result<T, ErrorMessage> {
	const { status, data: responseData } = response
	if (status !== statusResponse) {
		const { message } = obtainsError(response)
		return Err(message)
	}

	return Success(responseData.data[0])
}
