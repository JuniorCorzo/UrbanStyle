import type { SelectOptions } from '@/interface/form-mediator.interface'

export function getItemsFilter(selectedItems: SelectOptions[]) {
	return function itemsFilter(item: SelectOptions) {
		return selectedItems.indexOf(item) < 0
	}
}

export function getItemsFiltered(
	optionsItems: SelectOptions[],
	selectedItems: SelectOptions[],
	inputValue: string,
): SelectOptions[] {
	return optionsItems.filter(
		(item) =>
			!selectedItems.includes(item) && item.text.toLowerCase().includes(inputValue.toLowerCase()),
	)
}

export function getItemFilter(inputValue: string) {
	return function itemFilter(item: SelectOptions) {
		return !inputValue || item.text.toLowerCase().includes(inputValue.toLowerCase())
	}
}
