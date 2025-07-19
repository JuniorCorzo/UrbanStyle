import { ORDER_STATUS } from '@/interface/orders.interface'
import { useCallback, useEffect, useState, type MouseEvent } from 'react'
import { OrderFilterOption } from './OrderFilterOption'
import { tableStore } from '@/state/table.state'

export type OrderOptions = keyof typeof ORDER_STATUS | 'ALL'

export function OrderFilterByStatus() {
	const [selectedItem, setSelectedItem] = useState<OrderOptions>('ALL')

	const handleClick = (event: MouseEvent<HTMLDivElement>) => {
		const target = event.target as HTMLDivElement
		const { status } = target.dataset

		if (target instanceof HTMLSpanElement) setSelectedItem(() => status as OrderOptions)
	}

	const setValue = () => (selectedItem === 'ALL' ? '' : selectedItem)

	useEffect(() => {
		const columnFilters = tableStore.get().columnFilters?.filter(({ id }) => id !== 'status') ?? []

		tableStore.setKey('columnFilters', [...columnFilters, { id: 'status', value: setValue() }])
	}, [selectedItem])

	return (
		<div
			className="border-border inline-flex max-h-11 gap-2 rounded-md border px-2 py-1.5"
			onClick={handleClick}
		>
			<OrderFilterOption status="ALL" selectedItem={selectedItem} />
			<OrderFilterOption status="PROCESSING" selectedItem={selectedItem} />
			<OrderFilterOption status="SENT" selectedItem={selectedItem} />
			<OrderFilterOption status="DELIVERED" selectedItem={selectedItem} />
			<OrderFilterOption status="CANCELED" selectedItem={selectedItem} />
		</div>
	)
}
