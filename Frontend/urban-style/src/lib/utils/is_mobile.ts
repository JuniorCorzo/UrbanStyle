export function detectMobile(): boolean | undefined {
	if (!navigator) {
		console.error('This function only web')
		return
	}

	const userAgent = navigator.userAgent || navigator.vendor

	return /Android|iPhone|iPad/.test(userAgent)
}
