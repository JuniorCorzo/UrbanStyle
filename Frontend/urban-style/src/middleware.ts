import { defineMiddleware } from 'astro:middleware'
import { AuthManager } from './scripts/auth/AuthManager'

export const onRequest = defineMiddleware(async (context, next) => {
	const isSessionValid = await AuthManager.authenticate(context)
	if (isSessionValid) return isSessionValid
	return next()
})
