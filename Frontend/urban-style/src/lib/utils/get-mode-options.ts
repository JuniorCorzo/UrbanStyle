import type { TABLE_MODE } from '@/interface/table-mediator.interface'

export function getModeOptions(mode: string) {
	const modeMap = new Map<keyof typeof TABLE_MODE, string>([
		['ALL', 'Todos los datos'],
		['REPORT', 'Reporte de ventas'],
	])

	return modeMap.get(mode as keyof typeof TABLE_MODE) ?? ""
}
