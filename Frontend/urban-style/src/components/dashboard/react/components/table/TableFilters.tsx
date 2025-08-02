import { tableStore } from '@/state/table.state'
import { useRef, type ChangeEvent } from 'react'
import { FiltersDropdown, type FilterDropdownRefProps } from './filters/FiltersDropdown'
import { FiltersButton } from './FiltersButton'
import { useStore } from '@nanostores/react'
import { OrderFilterByStatus } from '@/components/orders/react/components/OrderFilterByStatus'
import { Button } from '@/components/react/Button'
import { selectMediator } from '@/lib/utils/select-mediator'
import { dispatchShowSidebar } from '@/lib/utils/open-modal-event'
import { PlusCircleIcon } from '@heroicons/react/24/outline'

export function TableFilters() {
	const filterDropdownRef = useRef<FilterDropdownRefProps>(null)
	const { filterComponents, canSearch, hasForm } = useStore(tableStore)

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { value } = event.currentTarget
		tableStore.setKey('searchFilter', value)
	}

	const handleClick = () => filterDropdownRef.current?.toggle()

	const handleShowSidebar = async () => {
		dispatchShowSidebar()
	}

	return (
		<div className="flex w-full flex-col gap-y-3 sm:flex-row">
			<div className="lg:min-w-3xl flex w-full items-center">
				{filterComponents?.right && filterComponents.right()}
			</div>
			<div className="relative flex w-full items-center gap-2 sm:justify-end">
				<div className="flex min-h-10 flex-col gap-2 sm:flex-row sm:justify-end" title="Filtros">
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
					<div className="flex items-end gap-2">
						{filterComponents?.left && (
							<FiltersButton onClick={handleClick}>
								<FiltersDropdown ref={filterDropdownRef}>{filterComponents.left()}</FiltersDropdown>
							</FiltersButton>
						)}
						{hasForm && (
							<div>
								<Button
									className="bg-secondary shadow-border flex max-h-10 items-center gap-1"
									size="md"
									title="Mostrar formulario"
									onClick={handleShowSidebar}
								>
									<span>
										<PlusCircleIcon className="size-6 stroke-2" />
									</span>
									<span>Añadir</span>
								</Button>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
