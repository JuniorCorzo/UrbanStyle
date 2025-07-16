import { tableStore } from '@/state/table.state'
import { useRef, type ChangeEvent } from 'react'
import { FiltersDropdown, type FilterDropdownRefProps } from './filters/FiltersDropdown'
import { FiltersButton } from './FiltersButton'
import { useStore } from '@nanostores/react'
import { OrderFilterByStatus } from '@/components/orders/react/components/OrderFilterByStatus'

export function TableFilters() {
	const filterDropdownRef = useRef<FilterDropdownRefProps>(null)
	const { filterComponents, canSearch } = useStore(tableStore)

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { value } = event.currentTarget
		tableStore.setKey('searchFilter', value)
	}

	const handleClick = () => filterDropdownRef.current?.toggle()

	return (
		<div className="flex w-full items-center justify-between">
			<div>{filterComponents?.right && filterComponents.right()}</div>
			<div className="relative flex items-center justify-center gap-2">
				{canSearch && (
					<div className="h-fit">
						<input
							type="text"
							className="border-border focus:custom-ring h-10 w-full max-w-sm rounded border px-2"
							placeholder="Buscar..."
							onChange={handleChange}
						/>
					</div>
				)}
				<div className="h-10 w-fit" title="Filtros">
					{filterComponents?.left && (
						<FiltersButton onClick={handleClick}>
							{filterComponents.left(filterDropdownRef)}
						</FiltersButton>
					)}
				</div>
			</div>
		</div>
	)
}
