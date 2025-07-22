import type {
	SelectInputProps,
	SelectRefProps,
	SelectSingleProps,
} from '@/interface/form-mediator.interface'
import { Select } from './Select'
import { SelectMultiple } from './SelectMultiple'
import React, { useImperativeHandle, useRef } from 'react'

export const SelectInput = React.forwardRef<SelectRefProps, SelectInputProps>((props, ref) => {
	const selectRef = useRef<SelectRefProps>(null)
	useImperativeHandle(ref, () => ({
		selectedItems: () => selectRef.current?.selectedItems() ?? null,
	}))

	return (
		<>
			{props.isMultiple && <SelectMultiple ref={selectRef} {...props} />}
			{!props.isMultiple && <Select ref={selectRef} {...(props as SelectSingleProps)} />}
		</>
	)
})
