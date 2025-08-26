export const CHANGE_VARIANT = 'product:change-variant' as const

export type ChangeVariantEvent = {
	quantity: number
}

export function dispatchChangeVariantEvent(quantity: number) {
	document.dispatchEvent(
		new CustomEvent<ChangeVariantEvent>(CHANGE_VARIANT, {
			detail: {
				quantity,
			},
			cancelable: true,
		}),
	)
}
