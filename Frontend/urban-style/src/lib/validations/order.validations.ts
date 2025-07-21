import { ORDER_STATUS } from '@/interface/orders.interface'
import { z } from 'zod'

export const ChangeStatusScheme = z.object({
	status: z.nativeEnum(ORDER_STATUS, {
		message: 'Seleccione el estado de la orden para actualizar',
	}),
})
