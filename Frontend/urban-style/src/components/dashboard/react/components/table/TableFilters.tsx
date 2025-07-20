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
		const dashboardMediator = await selectMediator()
		if (dashboardMediator) {
			const { formType, sendData, title } = dashboardMediator.form
			dispatchShowSidebar(title, formType, sendData)
		}
	}

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
							<FiltersDropdown ref={filterDropdownRef}>{filterComponents.left()}</FiltersDropdown>
						</FiltersButton>
					)}
				</div>
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
	)
}
