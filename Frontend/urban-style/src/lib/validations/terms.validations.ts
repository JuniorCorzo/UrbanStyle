import { SEMVER_TYPE } from '@/const/terms.const'
import { z } from 'zod'

export const TermsScheme = z.object({
	semver: z.enum(Object.keys(SEMVER_TYPE) as [string, ...string[]]),
	file: z
		.instanceof(File)
		.refine((file) => file.size > 0, {
			message: 'Sube el archivo de Términos y Condiciones.',
		})
		.refine((file) => file.name.endsWith('.md'), {
			message: 'El archivo debe estar en formato Markdown (.md).',
		}),
})
