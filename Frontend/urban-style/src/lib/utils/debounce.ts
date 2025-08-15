export const debounce = <T extends (...args: any[]) => any>(fn: T, delay: number) => {
	let timeoutId: ReturnType<typeof setTimeout>
	return (...args: Parameters<T>): ReturnType<T> => {
		let result: any
		timeoutId && clearTimeout(timeoutId)

		timeoutId = setTimeout(() => {
			result = fn(...args)
		}, delay)

		return result
	}
}
