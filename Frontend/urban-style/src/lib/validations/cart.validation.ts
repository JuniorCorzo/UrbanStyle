import { z } from 'astro:schema'

export const CartCreateScheme = z.object({
	color: z.string().min(1, 'Selecciona un color de la lista'),
	size: z.string().min(1, 'Selecciona una talla de la lista'),
})
