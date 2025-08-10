import { useSearchParam } from '@/components/react/hooks/useSearchParam'
import { useEffect, useState, type MouseEvent } from 'react'

export const OPTIONS_TAB = {
	PERSONAL_DATA: 'Perfil',
	SECURITY: 'Seguridad',
	DIRECTIONS: 'Direcciones',
} as const
export type Options = keyof typeof OPTIONS_TAB

export const useOptionsTab = () => {
	const { setSearchParam } = useSearchParam()
	const [selectedItem, setSelectedItem] = useState<Options>()

	const isOption = (opt: string | undefined) => Object.keys(OPTIONS_TAB).includes(opt ?? '')

	const handleClick = (event: MouseEvent) => {
		const { value } = (event.target as HTMLElement).dataset
		if (!value || !isOption(value)) return

		setSelectedItem(value as Options)
		setSearchParam('option', value.toLowerCase())
	}

	useEffect(() => {
		const searchParam = new URLSearchParams(location.search)
		const initialParam = searchParam.get('option')?.toUpperCase()

		if (initialParam && isOption(initialParam)) {
			setSelectedItem(initialParam as Options)
		}
	}, [])

	return { selectedItem, handleClick }
}
