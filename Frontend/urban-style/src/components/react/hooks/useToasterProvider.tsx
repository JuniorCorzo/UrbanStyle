import type { ToastEvent, ToastPromiseEvent } from '@/lib/utils/ToasterManager'
import { useEffect } from 'react'
import { toast } from 'sonner'
import 'node_modules/sonner/dist/styles.css'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'

export function useToasterProvider() {
	const handlePromise = ({ detail }: CustomEvent<ToastPromiseEvent>) => {
		const { promise, config } = detail

		toast.promise(promise, {
			...config,
			loading: config.loading,
			success: {
				message: config.success,
				icon: <CheckCircleIcon className="size-5 text-green-700" />,
			},
			error: {
				message: config.error,
				icon: <XCircleIcon className="size-5 text-red-700" />,
			},
		})
	}

	const handleSuccess = ({ detail }: CustomEvent<ToastEvent>) => {
		const { config, title } = detail
		toast.success(title, {
			icon: <CheckCircleIcon className="size-5 text-green-700" />,
			...config,
		})
	}

	const handleError = ({ detail }: CustomEvent<ToastEvent>) => {
		const { config, title } = detail
		toast.error(title, {
			icon: <XCircleIcon className="size-5 text-red-700" />,
			...config,
		})
	}

	const setupListener = () => {
		document.addEventListener('toast:success', handleSuccess)
		document.addEventListener('toast:promise', handlePromise)
		document.addEventListener('toast:error', handleError)
	}

	const removeListener = () => {
		document.removeEventListener('toast:success', handleSuccess)
		document.removeEventListener('toast:promise', handlePromise)
		document.removeEventListener('toast:error', handleError)
	}

	useEffect(() => {
		setupListener()

		return () => {
			removeListener()
		}
	}, [])
}
