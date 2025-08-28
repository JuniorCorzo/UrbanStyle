import { Toaster } from 'sonner'
import { useToasterProvider } from './hooks/useToasterProvider'

export function ToasterProvider() {
	useToasterProvider()
	return (
		<Toaster
			position="bottom-right"
			className=""
			toastOptions={{
				classNames: {
					toast: '!bg-background !border !border-crust !shadow-sm !shadow-crust !text-text',
				},
			}}
		/>
	)
}
