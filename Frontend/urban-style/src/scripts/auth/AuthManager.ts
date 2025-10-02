import { AuthService } from '@/service/auth.service'
import { TermsService } from '@/service/terms.service'
import type { APIContext } from 'astro'

/**
 * Class responsible for handling authentication and authorization logic
 * including session validation, terms acceptance, and route permissions.
 */
class Auth {
	/** Search parameter used to control dialog display state */
	private static readonly SEARCH_PARAM: string = 'showDialog'

	/**
	 * Creates an instance of Auth.
	 * @param context - The Astro API context containing request and response information
	 */
	constructor(readonly context: APIContext) {}

	/**
	 * Main authentication method that validates the user session,
	 * checks route permissions, and validates terms acceptance.
	 * @returns A Promise that resolves to either true or a redirect Response
	 */
	async authenticate() {
		await this.validateSession()

		const isPermited = this.requestPermited()
		if (isPermited) return isPermited

		const consentAccepted = await this.validateTerms()
		if (consentAccepted) return true
		return this.context.redirect(this.setSearchParam())
	}

	/**
	 * Validates the user's session by checking the access token in cookies
	 * and verifying it with the auth service. If valid, sets the user and
	 * access token in the context locals.
	 */
	private async validateSession(): Promise<void> {
		const cookie = this.context.request.headers.get('cookie')
		if (!cookie) return

		const user = await AuthService.verifyToken(cookie)
		if (!user.success) {
			console.error(user.error)
			return
		}

		this.context.locals.user = user.data
		this.context.locals.accessToken = this.extractAccessToken(cookie)
	}

	/**
	 * Validates if the user has accepted the latest version of the terms.
	 * @returns Promise<boolean> - Returns true if terms are accepted or user is not logged in
	 */
	private async validateTerms(): Promise<boolean> {
		if (this.context.url.searchParams.has(Auth.SEARCH_PARAM)) return true
		const response = await TermsService.getCurrentVersion()
		if (!response.success) {
			console.error(response.error)
			return false
		}

		const { user } = this.context.locals
		if (!user) return true
		return !!user.dataConsent && user.dataConsent.version !== response.data
	}

	/**
	 * Checks if the user has permission to access the requested route.
	 * @returns Response if access is denied, undefined if access is permitted
	 */
	private requestPermited(): Response | undefined {
		const userPermittedRoutes = ['/perfil', '/shopping-cart', '/profile']
		const adminRoutes = ['/dashboard', '/dashboard/management', '/guides/terms']

		const user = this.context.locals.user
		const urlRequest = this.context.url.pathname

		const isUserRoute = userPermittedRoutes.some((route) => urlRequest.startsWith(route))
		const isAdminRoute = adminRoutes.some((route) => urlRequest.startsWith(route))

		if ((!user && (isUserRoute || isAdminRoute)) || (user?.role === 'ROLE_USER' && isAdminRoute)) {
			return this.context.redirect('/404')
		}
	}

	/**
	 * Extracts the access token from the cookie string.
	 * @param cookie - The raw cookie string from the request headers
	 * @returns The extracted access token value
	 */
	private extractAccessToken(cookie: string): string {
		return cookie
			.split(';')
			.filter((cookie) => cookie.startsWith('accessToken'))
			.map((accessToken) => accessToken.split('=')[1])[0]
	}

	/**
	 * Adds the showDialog search parameter to the current URL.
	 * @returns The URL string with the added search parameter
	 */
	private setSearchParam() {
		const url: URL = this.context.url
		url.searchParams.set(Auth.SEARCH_PARAM, 'true')
		return url.toString()
	}
}

/**
 * Exports the AuthManager object with the authenticate method.
 * This is the main entry point for authentication in the application.
 */
export const AuthManager = {
	/**
	 * Creates a new Auth instance and authenticates the request.
	 * @param context - The Astro API context
	 * @returns Promise resolving to either true or a redirect Response
	 */
	authenticate: (context: APIContext) => new Auth(context).authenticate(),
}
