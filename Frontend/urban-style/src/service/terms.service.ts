import { extractSingleResponse, obtainsError } from '@/adapter/responses.adapter'
import { PUBLIC_API_URL } from '@/config/env-config'
import type { ErrorMessage, Response } from '@/interface/response.interface'
import type { Term } from '@/interface/terms.interface'
import { Err, type Result, Success } from '@/lib/result_pattern'
import axios from 'axios'

async function getCurrentTerms(): Promise<Result<Term, ErrorMessage>> {
	const response = await axios.get<Response<Term>>(`${PUBLIC_API_URL}/terms/current`, {
		validateStatus: () => true,
	})

	return extractSingleResponse(response)
}

async function getTermByVersion(version: string): Promise<Result<Term, ErrorMessage>> {
	const response = await axios.get<Response<Term>>(`${PUBLIC_API_URL}/terms?version=${version}`, {
		validateStatus: () => true,
	})

	return extractSingleResponse(response)
}

async function publishTerm(formData: FormData): Promise<Result<string, ErrorMessage>> {
	const response = await axios.post<Response<never>>(`${PUBLIC_API_URL}/terms/publish`, formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
		withCredentials: true,
	})
	if (response.status !== 201) {
		const { message } = obtainsError(response)
		return Err(message)
	}

	return Success(response.data.message)
}

export const TermsService = {
	getCurrentTerms,
	getTermByVersion,
	publishTerm,
}
