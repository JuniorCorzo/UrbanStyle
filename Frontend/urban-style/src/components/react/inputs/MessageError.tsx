import { ExclamationCircleIcon } from '@heroicons/react/24/outline'

interface Props {
	errorId: string
}

export function MessageError({ errorId }: Props) {
	return (
		<span className="text-maroon flex items-center gap-1 opacity-0 transition-opacity duration-300">
			<span className="invisible hidden min-h-6 min-w-6">
				<ExclamationCircleIcon className="size-6" />
			</span>
			<span id={errorId} className="text-pretty font-bold transition-all"></span>
		</span>
	)
}
