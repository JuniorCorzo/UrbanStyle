import { cn } from '@/lib/cn'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useForm } from '../hooks/useForm'
import { ProductFormFields } from '@/components/dashboard/react/components/forms/ProductFormFields'
import { CategoriesFormFields } from './forms/CategoriesFormFields'
import { Button } from '@/components/react/Button'

export interface FormFieldsProps<T> {
	getDefaultValues: () => T | undefined
}

export function Sidebar() {
	const {
		visible,
		formType,
		handleOpen,
		handleSubmit,
		title,
		id,
		getProductValues,
		getCategoryValues,
	} = useForm()

	return (
		<aside
			className={cn(
				'bg-background border-border invisible fixed right-0 z-50 ml-5 h-full min-h-dvh w-full max-w-xl overflow-auto border-l-2 pb-10',
				visible && 'animate-aside-open visible',
				formType && 'animate-aside-close',
			)}
		>
			<div className="bg-accent/70 backdrop-blur-xs sticky top-0 z-[9999] flex items-center justify-between px-5 py-3">
				<h2 className="text-text text-xl font-medium">{title}</h2>
				<XMarkIcon onClick={handleOpen} className="size-7 cursor-pointer"></XMarkIcon>
			</div>
			<div>
				<form
					method="dialog"
					className="flex w-full flex-col items-center justify-center gap-4 overflow-y-visible pt-4"
					data-astro-reload
					onSubmit={handleSubmit}
				>
					<div className="flex w-full max-w-md flex-col items-center justify-center gap-4">
						{formType === 'product' && (
							<ProductFormFields key={id} getDefaultValues={getProductValues} />
						)}
						{formType === 'category' && (
							<CategoriesFormFields key={id} getDefaultValues={getCategoryValues} />
						)}
						<div className="col-span-full flex w-full justify-center">
							<Button className="w-full" type="submit">
								Enviar
							</Button>
						</div>
					</div>
				</form>
			</div>
		</aside>
	)
}
