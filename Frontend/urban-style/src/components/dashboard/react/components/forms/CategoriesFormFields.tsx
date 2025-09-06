import { TextAreaInput } from '@/components/react/inputs/TextAreaInput'
import TextInput from '@/components/react/inputs/TextInput'
import type { FormFieldsProps } from '../FormSidebar'
import type { Category } from '@/interface/category.interface'
import { useFormHandler } from '@/components/react/hooks/useFormHandler'
import { CategoryScheme } from '@/lib/validations/category.validations'

export function CategoriesFormFields({ getDefaultValues }: FormFieldsProps<Category>) {
	const { formState: categoryState, handleInputChange } = useFormHandler({
		initializerData: getDefaultValues(),
		validate: CategoryScheme,
	})
	const { name, description } = categoryState.getAll()
	return (
		<>
			<TextInput
				label="Nombre de la categoría"
				placeholder="Ej: Hombre, Accesorios, Electrónica"
				name="name"
				value={name}
				onChange={handleInputChange}
			/>
			<TextAreaInput
				label="Descripción de la categoría"
				placeholder="Explica qué tipo de productos contiene"
				name="description"
				value={description}
				onChange={handleInputChange}
			/>
		</>
	)
}
