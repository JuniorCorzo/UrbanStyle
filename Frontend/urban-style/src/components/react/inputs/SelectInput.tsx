import type { FieldProperties, SelectOptions } from '@/interface/form-mediator.interface'
import { SelectMultiple, type SelectMultipleProps } from './SelectMultiple'
import { Select, type SelectProps } from './Select'

export interface SelectInputProps extends Omit<FieldProperties, 'value'> {
	value?: SelectOptions | SelectOptions[]
	search?: boolean
	closeOnSelect?: boolean
	onChange?: (value: string, label: string) => void
}

export default function SelectInput(Props: SelectInputProps) {
	const { isMultiple } = Props

	return (
		<>
			{isMultiple && <SelectMultiple {...(Props as SelectMultipleProps)} />}
			{!isMultiple && <Select {...(Props as SelectProps)} />}
		</>
	)
}
