import type { GetItemsProps, GetMenuProps } from '@/components/react/inputs/SelectList'
import { createContext, useContext } from 'react'

export interface DropdownContextProps {
	isOpen: boolean
	getMenuProps: GetMenuProps<string>
	getItemProps: GetItemsProps<string>
	highlightedIndex: number
}

export const DropdownContext = createContext<DropdownContextProps | null>(null)

export const useDropdownContext = () => {
	const context = useContext(DropdownContext)
	if (!context) throw new Error('Dropdown.* must be used inside <Dropdown>')
	return context
}
