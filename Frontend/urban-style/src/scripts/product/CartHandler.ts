import type { Cart } from '@/interface/cart.interface'
import type { ChangeVariantEvent } from '@/lib/custom-events/change-variants'
import { $ } from '@/lib/dom-selector'
import { showError } from '@/lib/showErrorMessages'
import { dispatchCartCountEvent } from '@/lib/utils/cart-count-event'
import { CartCreateScheme } from '@/lib/validations/cart.validation'
import { CartService } from '@/service/cart.service'
import { ProductStore } from '@/state/product.store'
import { z } from 'zod'

const SELECTORS = {
	PRODUCT_QUANTITY: '#product_quantity',
} as const

/**
 * Send the actual cart to api
 *
 * @param createCart cart to send
 */
const sendCart = (createCart: Cart) => {
	CartService()
		.addProductToCart(createCart)
		.then((cart) => {
			dispatchCartCountEvent(cart.items.length)
		})
}

/**
 * Extracts userId and productQuantity from the event.
 * @param event - MouseEvent from the click action
 * @returns An object containing userId and productQuantity, or null if missing
 */
function extractEventData(event: MouseEvent): { userId: string; productQuantity: number } | null {
	const target = event.target as HTMLButtonElement
	const userId = target.dataset.userId
	const quantityInput = $(SELECTORS.PRODUCT_QUANTITY) as HTMLInputElement | null
	if (!userId || !quantityInput) return null

	return { userId, productQuantity: quantityInput.valueAsNumber }
}

/**
 * Retrieves product details from the store based on productId.
 * @param productId - ID of the product to find
 * @returns Product details (name, price, discount) or null if not found
 */
async function fetchProductDetails(
	productId: string,
): Promise<{ name: string; price: number; discount: number } | null> {
	const { productStore } = await ProductStore()
	const product = productStore.get().find((item) => item.id === productId)

	if (!product || product.discount === undefined) return null
	const { name, price, discount } = product

	return { name, price, discount }
}

/**
 * Parses color and size inputs from the DOM.
 *
 * @returns An object containing color and size strings, or null if parsing fails
 */
function getVariants(): Partial<{ color: string; size: string }> {
	const searchParam = new URLSearchParams(location.search)
	const color = searchParam.get('color') ?? undefined
	const size = searchParam.get('size') ?? undefined

	return { color, size }
}

/**
 * Constructs the Cart object based on provided parameters.
 *
 * @param userId - ID of the user
 * @param productId - ID of the product
 * @param name - Product name
 * @param price - Product price
 * @param discount - Product discount
 * @param color - Chosen color
 * @param size - Chosen size
 * @param quantity - Quantity to add
 * @returns A Cart object ready to be sent
 */
function buildCart(
	userId: string,
	productId: string,
	name: string,
	price: number,
	discount: number,
	color: string,
	size: string,
	quantity: number,
): Cart {
	return {
		userId,
		items: [{ productId, name, color, size, discount, price, quantity }],
	}
}

/**
 * Main click handler to add a product to the cart.
 *
 * @param productId - ID of the product to add
 * @param event - MouseEvent from the click action
 */
async function handleClick(event: MouseEvent): Promise<void> {
	const productId = new URLSearchParams(location.search).get('id')
	if (!productId) return

	const eventData = extractEventData(event)
	if (!eventData) return
	const { userId, productQuantity } = eventData

	const productDetails = await fetchProductDetails(productId)
	if (!productDetails) return
	const { name, price, discount } = productDetails

	const variant = getVariants()
	const { color, size } = variant ?? {}

	try {
		CartCreateScheme.parse({ color, size })
	} catch (err) {
		if (err instanceof z.ZodError) {
			showError(err)
			return
		}
		console.error('Validation error:', err)
		return
	}

	// Build and send cart
	if (!color || !size) return
	const cart = buildCart(userId, productId, name, price, discount, color, size, productQuantity)
	sendCart(cart)
}

/**
 * Sets the maximum quantity based on the product variant selected by the user
 *
 * @author JuniorCorzo
 * @param event it's custom event dispatch when change any product variant
 * @returns void
 */
function handleCounterMax(event: CustomEvent<ChangeVariantEvent>): void {
	const $inputCounter = $<HTMLInputElement>(SELECTORS.PRODUCT_QUANTITY)
	const inputValue = $inputCounter?.valueAsNumber ?? 0
	const maxNumber = event.detail.quantity

	if (!$inputCounter) {
		console.error('Not input element found in DOM')
		event.stopPropagation()
		return
	}

	if (inputValue > maxNumber) $inputCounter.value = String(maxNumber)
	$inputCounter.max = String(maxNumber)
}

/**
 * Initialize the events listener for cart handler
 */
function setupEventListener() {
	$('#add_cart')?.addEventListener('click', handleClick)
	document.addEventListener('product:change-variant', handleCounterMax)
}

export default {
	setupEventListener,
}
