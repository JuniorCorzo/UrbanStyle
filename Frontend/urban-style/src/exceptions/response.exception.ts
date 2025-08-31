import type { ErrorMessage } from '@/interface/response.interface'

export class ResponseException extends Error {
	constructor(error: ErrorMessage) {
		super(ResponseException.extractMessage(error))
		this.name = 'ResponseException'

		Object.setPrototypeOf(this, new.target.prototype)
	}

	private static extractMessage(error: ErrorMessage): string {
		if (Array.isArray(error)) {
			return Object.entries(error)
				.map(([key, value]) => `[${key}]: ${value}`)
				.join('\n')
		}

		return error
	}
}
