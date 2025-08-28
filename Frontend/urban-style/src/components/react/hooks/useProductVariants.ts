import { useState, useRef, useMemo, useEffect } from 'react'
import type { ProductVariantSelectorsProps } from '../ProductVariantSelectors'
import { useSearchParam } from './useSearchParam'
import { dispatchChangeVariantEvent } from '@/lib/custom-events/change-variants'

export function useProductVariants({
	attributes,
	defaultColor,
	defaultSize,
}: ProductVariantSelectorsProps) {
	const { setSearchParam } = useSearchParam()
	const [color, setColor] = useState<string | undefined>(defaultColor)
	const sizeSelected = useRef<string>(defaultSize)

	const colorOptions = useMemo(
		() => Array.from(new Set(attributes.map((attr) => attr.color))).map((color) => color),
		[attributes],
	)

	const sizeOptions = useMemo(
		() => attributes.filter((attr) => attr.color === color).map(({ size }) => size),
		[color, attributes],
	)

	const getStock = (color: string, size: string) =>
		attributes.find((attr) => attr.color === color && attr.size === size)?.quantity ?? 0

	useEffect(() => {
		if (!defaultColor) setColor(colorOptions[0])

		if (!defaultSize) {
			sizeSelected.current = attributes[0].size
			handleSizeSelect(sizeSelected.current)
		}
	}, [])

	useEffect(() => {
		const currentStock = getStock(color ?? '', sizeSelected.current ?? '')
		dispatchChangeVariantEvent(currentStock)
	}, [color, sizeSelected.current])

	useEffect(() => setSearchParam('color', color ?? ''), [color])
	const handleColorSelect = (color: string) => {
		if (!color) return

		setColor(color)
	}

	const handleSizeSelect = (size: string) => {
		if (!size) return

		sizeSelected.current = size
		setSearchParam('size', size)
	}

	return {
		colorOptions,
		sizeOptions,
		sizeSelected,
		handleColorSelect,
		handleSizeSelect,
	}
}
