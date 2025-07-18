import React, { useEffect, useMemo, useState } from 'react'
import SelectInput from '@/components/react/inputs/SelectInput'
import type { Attributes } from '@/interface/product.interface'
import { useSearchParam } from './hooks/useSearchParam'
import type { SelectOptions } from '@/interface/form-mediator.interface'

interface ProductVariantSelectorsProps {
	attributes: Attributes[]
	defaultColor?: string
	defaultSize?: string
}

export function ProductVariantSelectors({
	attributes,
	defaultColor,
	defaultSize,
}: ProductVariantSelectorsProps) {
	const { setSearchParam } = useSearchParam()
	const [color, setColor] = useState<string>()
	const [sizeOptions, setSizeOptions] = useState<SelectOptions[]>()

	const colorOptions = useMemo(
		() =>
			Array.from(new Set(attributes.map((attr) => attr.color))).map((color) => ({
				text: color,
				value: color,
			})),
		[],
	)

	useMemo(
		() =>
			setSizeOptions(
				attributes
					.filter((attr) => attr.color === color)
					.map(({ size }) => ({ text: size, value: size })),
			),
		[color],
	)

	const handleChangeColor = (_: string, label: string) => {
		setColor(label)
		setSearchParam('color', label)
	}

	const handleChangeSize = (_: string, label: string) => {
		setSearchParam('size', label)
	}

	return (
		<div className="flex min-h-[42px] w-full flex-col gap-4 sm:flex-row">
			<div className="grow">
				<SelectInput
					label="Color:"
					name="color"
					placeholder="-- Color --"
					search={false}
					options={colorOptions}
					value={defaultColor ? { text: defaultColor, value: defaultColor } : colorOptions[0]}
					onChange={handleChangeColor}
				/>
			</div>
			<div className="basis-1/3" key={sizeOptions?.length}>
				<SelectInput
					label="Talla:"
					name="size"
					placeholder="-- Talla --"
					search={false}
					options={sizeOptions}
					value={defaultSize ? { text: defaultSize, value: defaultSize } : undefined}
					onChange={handleChangeSize}
				/>
			</div>
		</div>
	)
}

export default ProductVariantSelectors
