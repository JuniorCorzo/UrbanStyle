
export const debounce = (fn: (...args: any[]) => void, delay: number) => {
	let timeoutId: NodeJS.Timeout
	return (...args: any[]) => {
		clearTimeout(timeoutId)
		timeoutId = setTimeout(() => fn(...args), delay)
	}
}
