import { useEffect, useMemo, useRef, useState } from 'react'
import type { Attribute } from '@/interface/product.interface'
import { useSearchParam } from './hooks/useSearchParam'
import { VariantSelector } from './VariantSelector'
import { useProductVariants } from './hooks/useProductVariants'

export type ProductVariantSelectorsProps = {
	attributes: Attribute[]
	defaultColor?: string
	defaultSize?: string
}

export function ProductVariantSelectors({
	attributes,
	defaultColor,
	defaultSize,
}: ProductVariantSelectorsProps) {
	const { colorOptions, sizeOptions, sizeSelected, handleColorSelect, handleSizeSelect } =
		useProductVariants({
			attributes,
			defaultColor,
			defaultSize,
		})

	return (
		<div className="flex w-full flex-col gap-3">
			<div className="flex flex-col gap-1">
				<span>Color</span>
				<div className="flex px-2">
					{colorOptions.map((color) => (
						<VariantSelector
							key={color}
							value={color}
							text={color}
							selected={color === color}
							onSelect={handleColorSelect}
						/>
					))}
				</div>
			</div>
			<div className="flex flex-col gap-1">
				<span>Tallas</span>
				<div className="flex gap-2 px-2">
					{sizeOptions.map((size) => (
						<VariantSelector
							key={size}
							value={size}
							text={size}
							selected={size === sizeSelected.current}
							onSelect={handleSizeSelect}
						/>
					))}
				</div>
			</div>
		</div>
	)
}

export default ProductVariantSelectors
