import { forwardRef, useEffect, useImperativeHandle, useMemo, useReducer, useState } from 'react'
import { Dropdown } from '../../Dropdown'
import { categoriesStore } from '@/state/categories.store'
import { FilterItem } from './FilterItem'
import { cn } from '@/lib/cn'
import type { Category } from '@/interface/category.interface'
import { computed } from 'nanostores'
import { productStore } from '@/state/product.store'
import { $$ } from '@/lib/dom-selector'
import type { ColumnFiltersState } from '@tanstack/react-table'
import { tableStore } from '@/state/table.state'

interface Props extends React.ComponentPropsWithoutRef<'div'> {}
export interface FilterDropdownRefProps {
	toggle: () => void
	getFiltersValues?: () => string[]
}

enum CheckedType {
	ADD_VALUE,
	DELETE_VALUE,
}

interface CheckedActions {
	type: keyof typeof CheckedType
	payload: {
		columnId: string
		checkedValue: string
	}
}

function checkedReducer(state: string[], action: CheckedActions): string[] {
	const { type, payload } = action
	const columnFilters = tableStore.get().columnFilters
	if (!columnFilters) {
		console.log('columns filters undefined')
		return state
	}

	switch (type) {
		case 'ADD_VALUE':
			if (state.includes(action.payload.checkedValue)) return state

			tableStore.setKey('columnFilters', [
				...columnFilters,
				{ id: payload.columnId, value: payload.checkedValue },
			])

			return [...state, payload.checkedValue]
		case 'DELETE_VALUE':
			tableStore.setKey(
				'columnFilters',
				columnFilters.filter(({ value }) => value !== payload.checkedValue),
			)

			return state.filter((value) => value !== payload.checkedValue)
		default:
			return state
	}
}

export const FiltersDropdown = forwardRef<FilterDropdownRefProps, Props>(({ ...props }, ref) => {
	const [categories, setCategories] = useState<Category[]>([])
	const [_, dispatch] = useReducer(checkedReducer, [])
	const [isVisible, setIsVisible] = useState(false)

	const colors: string[] = useMemo(
		() =>
			computed(productStore, (product) => {
				const colorsUnique = new Set<string>()
				product.map(({ attributes }) => attributes.map(({ color }) => colorsUnique.add(color)))
				return Array.from(colorsUnique)
			}).get(),
		[productStore.get()],
	)

	useEffect(() => {
		categoriesStore.subscribe((categories) => setCategories([...categories]))
	}, [])

	useImperativeHandle(ref, () => ({
		toggle: () => setIsVisible((prev) => !prev),
	}))

	const handleDispatchChecked = (checkedValue: string, columnId: string, isChecked: boolean) => {
		if (isChecked) {
			dispatch({
				type: 'ADD_VALUE',
				payload: {
					columnId,
					checkedValue,
				},
			})

			return
		}

		dispatch({
			type: 'DELETE_VALUE',
			payload: {
				columnId,
				checkedValue,
			},
		})
	}

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
				<Dropdown className="select-none px-4 py-2 text-left text-sm uppercase" label="Categoría">
					<Dropdown.Menu className="border-0 border-b px-5 pb-2 shadow-none">
						{categories?.map(({ name }) => (
							<FilterItem
								className="text-sm"
								name={name}
								handleDispatchChecked={handleDispatchChecked}
								columnId="categories"
							/>
						))}
					</Dropdown.Menu>
				</Dropdown>
				<Dropdown className="px-4 py-2 text-left text-sm uppercase" label="Color">
					<Dropdown.Menu className="border-0 px-5 py-2 shadow-none">
						{colors?.map((color) => (
							<FilterItem
								className="text-sm"
								name={color}
								handleDispatchChecked={handleDispatchChecked}
								columnId="attributes.color"
							/>
						))}
					</Dropdown.Menu>
				</Dropdown>
			</div>
		</div>
	)
})
