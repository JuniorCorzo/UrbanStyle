import type { Attribute } from '@/interface/product.interface'
import { AttributeTable } from './AttributeTable'
import { AttributeFormFields } from './AttributeFormFields'
import { useAttributes } from '../../hooks/useAttributes'
import { MessageError } from '@/components/react/inputs/MessageError'

export interface AttributesWithId extends Omit<Attribute, 'sku'> {
	id: string
}

interface Props {
	name: string
	defaultAttributes?: AttributesWithId[]
}

export function AttributeFields({ name, defaultAttributes = [] }: Props) {
	const {
		attributes,
		containerRef,
		handleAddAttribute,
		handleChangeQuantity,
		handleRemoveAttribute,
	} = useAttributes(defaultAttributes)
	return (
		<div ref={containerRef} className="flex w-full flex-col gap-1">
			<span className="">
				<h2>Atributos de producto</h2>
			</span>
			<MessageError errorId={`${name}_error`} />
			<AttributeTable
				attributes={attributes}
				onRemove={handleRemoveAttribute}
				onChangeQuantity={handleChangeQuantity}
			/>
			<AttributeFormFields handleAddAttribute={handleAddAttribute} />
			<input
				name={name}
				className="hidden"
				type="hidden"
				defaultValue={JSON.stringify(attributes)}
				readOnly
			/>
		</div>
	)
}
