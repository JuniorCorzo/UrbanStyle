import type { ProductInventory } from '@/interface/product.interface'
import type { SubComponentProps } from '@/interface/table-mediator.interface'
import { Cell } from './Cell'
import { OPERATION_TYPE } from '@/interface/stock_movements.interface'
import { ArrowLongRightIcon } from '@heroicons/react/24/outline'

export function ProductInventorySubComponent({ row }: SubComponentProps<ProductInventory>) {
	const { movements } = row.original
	return (
		<div className="w-full max-w-full overflow-auto">
			<table className="bg-background table-fixed">
				<thead className="bg-accent">
					<tr className="w-full">
						<th className="h-11 text-nowrap px-2" style={{ minWidth: 150, maxWidth: 200 }}>
							Operación
						</th>
						<th className="h-11 px-2" style={{ minWidth: 150, maxWidth: 300 }}>
							Encargado
						</th>
						<th className="h-11 text-nowrap px-2" style={{ minWidth: 150, maxWidth: 300 }}>
							Referencia a
						</th>
						<th className="h-11 px-2" style={{ minWidth: 150, maxWidth: 300 }}>
							Movimiento
						</th>
						<th className="h-11 px-2" style={{ minWidth: 150, maxWidth: 300 }}>
							Stock
						</th>
						<th className="h-11 px-2" style={{ minWidth: 150, maxWidth: 300 }}>
							Realizado el
						</th>
					</tr>
				</thead>
				<tbody>
					{movements.map(
						({
							operationType,
							performedBy,
							referenceBy,
							quantityChange,
							previousStock,
							newStock,
							timestamp,
						}) => (
							<tr
								className="border-border/20 hover:bg-foreground border-b"
								key={crypto.randomUUID()}
							>
								<Cell style={{ minWidth: 150, maxWidth: 200 }}>
									{OPERATION_TYPE[operationType]}
								</Cell>
								<Cell style={{ minWidth: 150, maxWidth: 300 }}>{performedBy ?? 'N/A'}</Cell>
								<Cell style={{ minWidth: 150, maxWidth: 300 }}>{referenceBy ?? 'N/A'}</Cell>
								<Cell style={{ minWidth: 150, maxWidth: 300 }}>{quantityChange}</Cell>
								<Cell
									className="flex items-center justify-center gap-1"
									style={{ minWidth: 150, maxWidth: 300 }}
								>
									<span>{previousStock}</span>
									<ArrowLongRightIcon className="size-6" />
									<span>{newStock}</span>
								</Cell>
								<Cell style={{ minWidth: 150, maxWidth: 300 }}>
									{Intl.DateTimeFormat('es-CO', {
										dateStyle: 'short',
										timeStyle: 'short',
									}).format(new Date(timestamp))}
								</Cell>
							</tr>
						),
					)}
				</tbody>
			</table>
		</div>
	)
}
