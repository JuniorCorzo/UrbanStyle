import type { SelectInputProps, SelectSingleProps } from '@/interface/form-mediator.interface'
import { Select } from './Select'
import { SelectMultiple } from './SelectMultiple'

export default function SelectInput(props: SelectInputProps) {
	return (
		<>
			{props.isMultiple && <SelectMultiple {...props} />}
			{!props.isMultiple && <Select {...(props as SelectSingleProps)} />}
		</>
	)
}
