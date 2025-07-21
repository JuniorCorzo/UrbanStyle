import { productStore } from '@/state/product.store'
import { computed } from 'nanostores'
import { useMemo } from 'react'
import { Dropdown } from '../../Dropdown'
import { FilterItem } from './FilterItem'
import { useStore } from '@nanostores/react'
import { categoriesStore } from '@/state/categories.store'

export function ProductFilter() {
	const categories = useStore(categoriesStore)
	const colors: string[] = useMemo(
		() =>
			computed(productStore, (product) => {
				const colorsUnique = new Set<string>()
				product.map(({ attributes }) => attributes.map(({ color }) => colorsUnique.add(color)))
				return Array.from(colorsUnique)
			}).get(),
		[productStore.get()],
	)

	return (
		<>
			<Dropdown className="select-none px-4 py-2 text-left text-sm uppercase" label="Categoría">
				<Dropdown.Menu className="border-0 border-b px-5 pb-2 shadow-none">
					{categories?.map(({ name }) => (
						<FilterItem
							className="text-sm"
							value={name}
							columnId="categories"
							key={crypto.randomUUID()}
						/>
					))}
				</Dropdown.Menu>
			</Dropdown>
			<Dropdown className="px-4 py-2 text-left text-sm uppercase" label="Color">
				<Dropdown.Menu className="border-0 px-5 py-2 shadow-none">
					{colors?.map((color) => (
						<FilterItem
							className="text-sm"
							value={color}
							columnId="attributes.color"
							key={crypto.randomUUID()}
						/>
					))}
				</Dropdown.Menu>
			</Dropdown>
		</>
	)
}
