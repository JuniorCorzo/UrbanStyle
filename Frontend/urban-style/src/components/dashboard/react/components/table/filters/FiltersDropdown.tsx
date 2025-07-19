import { forwardRef, useEffect, useImperativeHandle, useReducer, useState } from 'react'
import { cn } from '@/lib/cn'
import { tableStore } from '@/state/table.state'
import type { ColumnFilter, ColumnFiltersState } from '@tanstack/react-table'
import { FilterContext } from '../../../context/FilterContext'

interface FilterDropdownProps extends React.ComponentPropsWithoutRef<'div'> {
	children: React.ReactNode
}

export interface FilterDropdownRefProps {
	toggle: () => void
}

enum FilterTypes {
	ADD_VALUE,
	DELETE_VALUE,
}

export interface FilterActions {
	type: keyof typeof FilterTypes
	payload: ColumnFilter
}

function filterReducer(state: ColumnFiltersState, action: FilterActions): ColumnFiltersState {
	const { type, payload } = action
	const columnFilters = tableStore.get().columnFilters
	if (!columnFilters) {
		console.log('columns filters undefined')
		return state
	}

	switch (type) {
		case 'ADD_VALUE':
			if (state.includes(payload)) return state

			return [...state, payload]
		case 'DELETE_VALUE':
			return state.filter((filter) => filter.value !== payload.value)
		default:
			return state
	}
}

export const FiltersDropdown = forwardRef<FilterDropdownRefProps, FilterDropdownProps>(
	({ children, ...props }, ref) => {
		const [filterState, dispatch] = useReducer(filterReducer, [])
		const [isVisible, setIsVisible] = useState(false)

		useImperativeHandle(ref, () => ({
			toggle: () => setIsVisible((prev) => !prev),
		}))

		useEffect(() => tableStore.setKey('columnFilters', filterState), [filterState])

		return (
			<div
				className={cn(
					'bg-background border-border shadow-crust absolute right-0 top-full z-50 mt-2 hidden max-h-96 w-full max-w-72 flex-col overflow-auto rounded border shadow',
					isVisible ? 'animate-expand flex' : 'animate-contract',
				)}
				{...props}
			>
				<span className="border-border w-full border-b px-2 py-2">
					<h3 className="text-sm font-medium uppercase tracking-wide">Filtrar Por:</h3>
				</span>
				<div className="flex h-full flex-col">
					<FilterContext.Provider value={{ filterState, filterDispatch: dispatch }}>
						{children}
					</FilterContext.Provider>
				</div>
			</div>
		)
	},
)
