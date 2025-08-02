import type React from 'react'

export type FormType = 'product' | 'category'
export type SendForm = (formData?: FormData, id?: string) => void

export interface FormMediator {
	formType: FormType
	sendData: SendForm
	title: string
	sendDelete: (id: string) => void
}

export interface FieldProperties {
	className?: string
	label?: string
	name?: string
	value?: string | string[] | SelectOptions
	placeholder?: string
	required?: boolean
	options?: SelectOptions[]
	isMultiple?: boolean
	disable?: boolean
}

type SelectCommons = Omit<
	React.ComponentPropsWithoutRef<'select'>,
	'defaultValue' | 'multiple' | 'onChange'
> & {
	label?: string
	placeholder?: string
	options?: SelectOptions[]
	disable?: boolean
	isFloating?: boolean
}

export type SelectMultipleProps = {
	isMultiple?: true
	selectedItems?: SelectOptions[]
	defaultValue?: SelectOptions[]
	onChange?: (selectedItems: SelectOptions[] | null) => void
} & SelectCommons

export type SelectSingleProps = {
	isMultiple?: false
	selectItem?: SelectOptions
	defaultValue?: SelectOptions
	onChange?: (selectedItems: SelectOptions | null) => void
} & SelectCommons

export type SelectInputProps = SelectMultipleProps | SelectSingleProps
export type SelectRefProps = {
	selectedItems: () => SelectOptions | SelectOptions[] | null
	setSelectedItem?: (item: SelectOptions | null) => void
}

export type SelectOptions = {
	value: string
	text: string
}
