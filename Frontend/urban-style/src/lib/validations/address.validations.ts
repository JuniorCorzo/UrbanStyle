import { z } from 'astro:schema'

export const AddressScheme = z.object({
	street: z
		.string()
		.refine(
			(street) =>
				/^(Calle|Avenida|Carrera)\s+\d+(\s*#\s*\d+(-\d+)?)?(?:\s+[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+)?$/.test(
					street,
				),
			{
				message:
					"Ejemplo válido: 'Calle 45 #23-10'. Usa 'Calle', 'Avenida' o 'Carrera' seguido de un número.",
			},
		),
	city: z.string().min(1, ' Selecciona una ciudad de la lista'),
	state: z.string().min(1, 'Selecciona un departamento de la lista'),
	postalCode: z.string().refine((postalCode) => /^\d{6}$/.test(postalCode), {
		message: 'Código postal inválido (usa 6 dígitos)',
	}),
})
export type AddressValidate = z.infer<typeof AddressScheme>
