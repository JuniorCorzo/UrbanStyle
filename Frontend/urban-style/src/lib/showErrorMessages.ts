import { ZodError, type z, type ZodIssue } from 'zod'
import { $ } from './dom-selector'

declare global {
	interface HTMLInputElement {
		_clearErrorHandler?: EventListener
	}
}

export function toggleErrorMessage(message: string, $spanElement: HTMLSpanElement) {
	const $iconContainerElement = $spanElement.parentElement?.querySelector('span')
	const $parentSpanElement = $spanElement.parentElement
	const $inputElement = $parentSpanElement?.nextElementSibling as HTMLInputElement

	$spanElement.textContent = message
	if ($inputElement) createEventListener($spanElement.id, $inputElement)

	$iconContainerElement?.classList.remove('hidden', 'invisible')
	$parentSpanElement?.classList.remove('opacity-0')
	return
}

function createEventListener(id: string, $inputElement: HTMLInputElement) {
	removeEventListener($inputElement)
	$inputElement._clearErrorHandler = clearErrorMessage.bind(null, id, $inputElement)

	if ($inputElement instanceof HTMLDivElement) {
		$inputElement.addEventListener('click', $inputElement._clearErrorHandler)
		return
	}
	$inputElement?.addEventListener('input', $inputElement._clearErrorHandler)
}

function removeEventListener($inputElement: HTMLInputElement) {
	if ($inputElement._clearErrorHandler) {
		$inputElement.removeEventListener('input', $inputElement._clearErrorHandler)
		$inputElement._clearErrorHandler = undefined
	}
}

export function clearErrorMessage(id: string, $inputElement: HTMLInputElement) {
	const $spanElement = $<HTMLSpanElement>(`#${id}`)
	const $iconContainerElement = $spanElement?.parentElement?.querySelector('span')
	const $labelElement = $inputElement.parentElement

	if ($spanElement?.parentElement) {
		$iconContainerElement?.classList.add('hidden', 'invisible')
		$spanElement.parentElement.classList.add('opacity-0')
		$spanElement.textContent = ''
	}

	if ($labelElement instanceof HTMLLabelElement) {
		$labelElement?.style.setProperty('border-color', 'transparent')
	}

	removeEventListener($inputElement)
}

export function toggleErrorMessagesWithLabel(message: string, $spanElement: HTMLSpanElement) {
	const $labelElement = $spanElement.parentElement?.parentElement
	toggleErrorMessage(message, $spanElement)

	if (message.length > 0) {
		$labelElement?.style.setProperty('border-color', 'var(--color-red)')
		return
	}
}

type ZodErrorOrIssue = z.ZodError | ZodIssue

export const showError = (errors: ZodErrorOrIssue) => {
	if (errors instanceof ZodError) {
		errors.errors.forEach(({ message, path }) => {
			const $errorElement = $<HTMLSpanElement>(`#${path[0]}_error`)
			if ($errorElement) {
				toggleErrorMessagesWithLabel(message, $errorElement)
			}
		})
		return
	}

	const $errorElement = $<HTMLSpanElement>(`#${errors.path[0]}_error`)
	if ($errorElement) {
		toggleErrorMessagesWithLabel(errors.message, $errorElement)
	}
}

export const showErrorOnlyField = <T>(error: ZodError, key: keyof T) => {
	const errorPath = error.errors.find((err) => err.path.includes(key as string | number))
	if (errorPath) {
		showError(errorPath)
	}
}
