import type { BaseDocument as OriginalBaseDocument } from '@/interface/base.interface'

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type BaseDocument = OriginalBaseDocument & { [key: string]: any }

export function safeGet<D extends BaseDocument>(
	obj: D,
	path: string | string[],
	defaultValue: unknown = '',
): unknown {
	const keys = Array.isArray(path)
		? path
		: path
				.replace(/\[(\d+)\]/g, '.$1') // Convierte índices de arrays a notación de puntos
				.split('.')
				.filter(Boolean)

	return (
		keys.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj) ??
		defaultValue
	)
}
