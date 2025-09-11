import type { FieldProperties } from '@/interface/form-mediator.interface'
import LabelInput from './LabelInput'
import { type ChangeEvent } from 'react'
import { MessageError } from './MessageError'

export interface TextAreaProps extends React.ComponentPropsWithoutRef<'textarea'> {
	label?: string
}

export function TextAreaInput({
	className,
	label,
	name,
	placeholder,
	onChange,
	defaultValue,
	...props
}: TextAreaProps) {
	return (
		<LabelInput label={label}>
			<MessageError errorId={`${name}_error`} />
			<span>
				<textarea
					className="border-border focus:custom-ring field-sizing-content max-h-32 min-h-16 w-full border p-2"
					name={name}
					placeholder={placeholder}
					defaultValue={defaultValue}
					onChange={onChange}
					{...props}
				/>
			</span>
		</LabelInput>
	)
}
