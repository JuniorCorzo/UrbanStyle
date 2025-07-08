import { cn } from '@/lib/cn'
import { LabelInput } from './LabelInput'
import { MessageError } from './MessageError'

interface Props extends React.ComponentPropsWithoutRef<'input'> {
	label: string
}

export const TextInput = ({ label, name, className, ...props }: Props) => {
	return (
		<LabelInput label={label}>
			<MessageError errorId={`${name}_error`} />
			<input
				className={cn(
					'border-border focus:custom-ring text-text pointer-events-auto h-10 w-full rounded border px-2 py-1 focus:outline-none',
					className,
				)}
				name={name}
				{...props}
			/>
		</LabelInput>
	)
}

export default TextInput
