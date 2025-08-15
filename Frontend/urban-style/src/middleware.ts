import { defineMiddleware } from 'astro:middleware'
import { verifyToken } from './service/auth.service'
import type { APIContext } from 'astro'

export const onRequest = defineMiddleware(async (context, next) => {
	try {
		const cookie = context.request.headers.get('cookie')
		if (cookie) {
			const user = await verifyToken(cookie)
			if (!user) return next()

			context.locals.user = user
			context.locals.accessToken = cookie
				.split(';')
				.filter((cookie) => cookie.startsWith('accessToken'))
				.map((accessToken) => accessToken.split('=')[1])[0]

			console.log(context.locals.accessToken)
		}
	} catch (error) {
		console.error('Error validating session')
	} finally {
		const isRedirect = validateRequest(context)
		if (isRedirect) return isRedirect

		if (context.url.pathname === '/') return context.redirect('/home')
	}

	return next()
})

function validateRequest(context: APIContext) {
	const userPermittedRoutes = ['/perfil', '/shopping-cart', '/orders']
	const adminRoutes = ['/dashboard']

	const user = context.locals.user
	const urlRequest = context.url.pathname
	const isUserRoute = userPermittedRoutes.some((route) => urlRequest.startsWith(route))

	const isAdminRoute = adminRoutes.some((route) => urlRequest.startsWith(route))

	if (!user && (isUserRoute || isAdminRoute)) {
		return context.redirect('/404')
	}

	if (user?.role === 'ROLE_USER' && isAdminRoute) {
		return context.redirect('/404')
	}
}
