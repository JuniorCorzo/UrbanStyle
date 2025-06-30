export function convertToIso(date: string) {
	const splitDate = date.split('-')
	if (splitDate.length === 3) {
		return `${splitDate[2]}-${splitDate[1].padStart(2, '0')}-${splitDate[0]}`
	}

	return `${splitDate[1]}-${splitDate[0]}-01`
}
