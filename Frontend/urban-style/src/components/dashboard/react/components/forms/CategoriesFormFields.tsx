import { TextAreaInput } from '@/components/react/inputs/TextAreaInput'
import TextInput from '@/components/react/inputs/TextInput'
import type { FormFieldsProps } from '../Sidebar'
import type { Category } from '@/interface/category.interface'

export function CategoriesFormFields({ getDefaultValues }: FormFieldsProps<Category>) {
	const defaultValue = getDefaultValues()

	return (
		<>
			<TextInput
				label="Nombre de la categoría"
				placeholder="Ej: Hombre, Accesorios, Electrónica"
				name="name"
				defaultValue={defaultValue?.name}
			/>
			<TextAreaInput
				label="Descripción de la categoría"
				placeholder="Explica qué tipo de productos contiene"
				name="description"
				value={defaultValue?.description}
			/>
		</>
	)
}
