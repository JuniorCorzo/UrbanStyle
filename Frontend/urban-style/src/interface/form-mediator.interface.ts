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

export type SelectOptions = {
	value: string
	text: string
}
