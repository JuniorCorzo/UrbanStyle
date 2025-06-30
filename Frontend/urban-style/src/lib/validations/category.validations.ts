import { z } from 'astro:schema'

export const CategoryScheme = z.object({
	name: z.string().min(1, 'Ingrese el nombre'),
	description: z.string().min(1, 'Ingrese la descripción'),
})

export type CategoryValidate = z.infer<typeof CategoryScheme>
