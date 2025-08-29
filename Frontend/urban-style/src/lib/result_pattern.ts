export type Result<T, Err> =
	| {
			success: true
			data: T
	  }
	| {
			success: false
			error: Err
	  }

export function Success<T>(data: T): Result<T, never> {
	return { success: true, data }
}

export function Err<Err>(error: Err): Result<never, Err> {
	return { success: false, error }
}
