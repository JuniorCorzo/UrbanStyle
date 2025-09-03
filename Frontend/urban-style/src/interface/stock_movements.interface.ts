export const OPERATION_TYPE = {
	INITIAL_STOCK: 'Stock inicial',
	MANUAL_ADJUSTMENT: 'Ajuste manual',
	DELETE_ATTRIBUTE: 'Atributo eliminado',
	SALE: 'Venta',
	ORDER_CANCELLATION: 'Pedido cancelado',
} as const

export type OperationType = keyof typeof OPERATION_TYPE

export type StockMovements = {
	productId: string
	sku: string
	operationType: OperationType
	performedBy: string
	referenceBy: string
	quantityChange: number
	previousStock: number
	newStock: number
	timestamp: string
}
