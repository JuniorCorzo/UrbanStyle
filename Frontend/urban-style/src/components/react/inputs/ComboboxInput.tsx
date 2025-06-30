import { Combobox } from './Combobox'
import { ComboboxMultiple } from './ComboboxMultiple'
import type { SelectInputProps } from './SelectInput'

export interface ComboboxInputProps extends SelectInputProps {}

export function ComboboxInput({ ...props }: ComboboxInputProps) {
	const { isMultiple } = props
	return (
		<>
			{!isMultiple && <Combobox {...props} />}
			{isMultiple && <ComboboxMultiple {...props} />}
		</>
	)
}
