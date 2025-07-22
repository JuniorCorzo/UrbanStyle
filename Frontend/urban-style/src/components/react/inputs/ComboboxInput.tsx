import type {
	SelectInputProps,
	SelectOptions,
	SelectSingleProps,
} from '@/interface/form-mediator.interface'
import { Combobox } from './Combobox'
import { ComboboxMultiple } from './ComboboxMultiple'
import React, { useEffect, useImperativeHandle, useLayoutEffect, useRef } from 'react'

export type ComboboxInputProps = SelectInputProps
export type ComboboxRefProps = {
	selectedItem: SelectOptions | SelectOptions[] | null
}

export const ComboboxInput = React.forwardRef<ComboboxRefProps, ComboboxInputProps>(
	({ ...props }: ComboboxInputProps, ref) => {
		const comboboxRef = useRef<ComboboxRefProps>(null)

		useImperativeHandle(ref, () => ({
			selectedItem: comboboxRef.current?.selectedItem || null,
		}))

		return (
			<>
				{props.isMultiple && <ComboboxMultiple ref={comboboxRef} {...props} />}
				{!props.isMultiple && <Combobox ref={comboboxRef} {...(props as SelectSingleProps)} />}
			</>
		)
	},
)
