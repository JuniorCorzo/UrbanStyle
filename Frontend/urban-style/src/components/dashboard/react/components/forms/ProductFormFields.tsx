import { SelectInput } from '@/components/react/inputs/SelectInput'
import TextInput from '@/components/react/inputs/TextInput'
import type { SelectOptions } from '@/interface/form-mediator.interface'
import type { Products } from '@/interface/product.interface'
import { categoriesStore } from '@/state/categories.store'
import { useLayoutEffect, useState } from 'react'
import { AttributeFields } from './AttributeFields'
import { TextAreaInput } from '@/components/react/inputs/TextAreaInput'
import type { FormFieldsProps } from '../FormSidebar'
import { ImagesFileInput } from '@/components/react/inputs/ImagesFileInput'
import { useFormHandler } from '@/components/react/hooks/useFormHandler'
import { CreateProductScheme } from '@/lib/validations/product.validations'

export function ProductFormFields({ getDefaultValues }: FormFieldsProps<Products>) {
	const [categoriesOptions, setCategories] = useState<SelectOptions[]>()
	const { formState: productState, handleInputChange } = useFormHandler({
		initializerData: getDefaultValues(),
		validate: CreateProductScheme,
	})

	const getCategories = async (): Promise<SelectOptions[]> =>
		categoriesStore.get().map((category) => ({
			value: category.id,
			text: category.name,
		}))

	useLayoutEffect(() => {
		getCategories().then(setCategories)
	}, [])

	const { name, description, price, discount, categories, attributes, images } =
		productState.getAll()
	return (
		<>
			<TextInput
				label="Nombre del producto"
				name="name"
				placeholder="Ej: Camiseta básica unisex"
				value={name}
				onChange={handleInputChange}
			/>
			<TextAreaInput
				label="Descripción"
				name="description"
				placeholder="Describe el producto, materiales, uso…"
				value={description}
				onChange={handleInputChange}
			/>
			<TextInput
				label="Precio"
				name="price"
				placeholder="Ej: 59.900"
				value={price}
				onChange={handleInputChange}
			/>
			<TextInput
				label="Descuento (%)"
				name="discount"
				placeholder="Ej: 15"
				type="number"
				value={discount}
				onChange={handleInputChange}
			/>
			<SelectInput
				label="Categoría"
				name="categories"
				placeholder="Selecciona una o más categorías"
				isMultiple={true}
				defaultValue={categories?.map(({ categoryId, name }) => ({
					text: name,
					value: categoryId,
				}))}
				options={categoriesOptions}
			/>
			<AttributeFields
				name="attributes"
				defaultAttributes={attributes?.map((attribute) => ({
					id: crypto.randomUUID(),
					...attribute,
				}))}
			/>
			<ImagesFileInput label="Imágenes del producto" name="images" defaultImages={images} />
		</>
	)
}
