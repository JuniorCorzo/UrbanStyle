import { Children, type ReactNode } from 'react'

interface Props {
	children: ReactNode
}

export default function Cell({ children }: Props) {
	return (
		<td className="border-border min-h-11 max-w-72 border px-4 py-2 text-center">{children}</td>
	)
}
