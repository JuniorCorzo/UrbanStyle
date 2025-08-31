import type { ExternalToast } from 'sonner'

export type ToastEvent = { title: string; config: ExternalToast }
export type ToastPromiseEvent = {
	promise: Promise<unknown>
	config: ExternalToast & {
		loading?: string
		success?: string
		error?: string
		finally?: () => void | Promise<void>
	}
}

export const TOAST_EVENTS = {
	SUCCESS: 'toast:success',
	ERROR: 'toast:error',
	PROMISE: 'toast:promise',
} as const

function emitSuccess(title: string, config: ExternalToast) {
	document.dispatchEvent(
		new CustomEvent<ToastEvent>(TOAST_EVENTS.SUCCESS, {
			detail: {
				title,
				config,
			},
		}),
	)
}

function emitError(title: string, config: ExternalToast) {
	document.dispatchEvent(
		new CustomEvent<ToastEvent>(TOAST_EVENTS.ERROR, {
			detail: {
				title,
				config,
			},
		}),
	)
}

function emitPromise({ promise, config }: ToastPromiseEvent) {
	document.dispatchEvent(
		new CustomEvent<ToastPromiseEvent>(TOAST_EVENTS.PROMISE, {
			detail: {
				promise,
				config,
			},
		}),
	)
}

export default {
	emitSuccess,
	emitError,
	emitPromise,
}
