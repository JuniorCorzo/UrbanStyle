import { Button } from '@/components/react/Button'
import { ComboboxInput } from '@/components/react/inputs/ComboboxInput'
import SelectInput from '@/components/react/inputs/SelectInput'
import TextInput from '@/components/react/inputs/TextInput'
import { CLOTHING_COLORS, CLOTHING_SIZE } from '@/const/product.const'
import { cn } from '@/lib/cn'
import { ChevronDownIcon, ChevronUpDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

interface AttributeFormFieldsProps {
	handleAddAttribute: () => void
}

export function AttributeFormFields({ handleAddAttribute }: AttributeFormFieldsProps) {
	const [visible, setVisible] = useState(false)
	const handleVisible = () => setVisible((prev) => !prev)

	return (
		<div>
			<span className="text-crust flex w-full cursor-pointer items-center justify-end font-medium">
				<span className="flex items-center gap-2">
					{visible ? <ChevronUpIcon className="size-6" /> : <ChevronDownIcon className="size-6" />}
					<span onClick={handleVisible}>Añadir nuevos atributos</span>
				</span>
			</span>
			<div
				className={cn(
					'bg-background flex h-full w-full flex-col gap-4 overflow-hidden transition-all',
					visible ? 'animate-slide-down overflow-visible' : 'animate-slide-up h-0 max-h-0',
				)}
			>
				<ComboboxInput
					label="Color"
					name="color"
					placeholder="Ej: Rojo, Azul, Negro"
					required={true}
					options={CLOTHING_COLORS}
				/>
				<SelectInput
					label="Talla"
					name="size"
					placeholder="Ej: S, M, L,"
					required={true}
					options={CLOTHING_SIZE}
				/>
				<TextInput name="quantity" label="Cantidad disponible" placeholder="Ej: 10" />
				<Button className="w-full" type="button" onClick={handleAddAttribute}>
					Añadir
				</Button>
			</div>
		</div>
	)
}
