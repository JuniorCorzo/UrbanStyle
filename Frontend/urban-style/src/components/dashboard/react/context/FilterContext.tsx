import type { ColumnFiltersState } from '@tanstack/react-table'
import type React from 'react'
import type { FilterActions } from '../components/table/filters/FiltersDropdown'
import { createContext, useContext } from 'react'

interface FilterContextProps {
	filterState: ColumnFiltersState
	filterDispatch: React.ActionDispatch<[actions: FilterActions]>
}

export const FilterContext = createContext<FilterContextProps | null>(null)

export function useFilterContext() {
	const context = useContext(FilterContext)
	if (!context) throw new Error('Filter*: must be used inside <FilterContext>')
	return context
}
