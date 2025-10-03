import { AuthService } from '@/service/auth.service'
import { TermsService } from '@/service/terms.service'
import type { APIContext } from 'astro'

/**
 * Enum-like object that defines all possible states during terms validation
 * @readonly
 */
const TermsValidationStatus = {
	/** User has accepted the current version of terms */
	TERMS_ACCEPTED: 'TERMS_ACCEPTED',
	/** User has not accepted the current version of terms */
	TERMS_NOT_ACCEPTED: 'TERMS_NOT_ACCEPTED',
	/** An error occurred during terms validation */
	ERROR: 'ERROR',
	/** No user is currently logged in */
	USER_NOT_LOGGED: 'USER_NOT_LOGGED',
} as const

/** Type representing all possible terms validation states */
type TermsValidationState = keyof typeof TermsValidationStatus

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
	 * Main authentication method that orchestrates the authentication flow:
	 * 1. Validates the user session
	 * 2. Checks route permissions
	 * 3. Validates terms acceptance and manages the terms dialog visibility
	 * @returns A Promise that resolves to either a redirect Response or undefined
	 * If undefined is returned, the request can proceed normally
	 */
	async authenticate(): Promise<Response | undefined> {
		await this.validateSession()

		const isPermited = this.requestPermited()
		if (isPermited) return isPermited

		const consentAccepted = await this.validateTerms()
		const hasSearchParam = this.context.url.searchParams.has(Auth.SEARCH_PARAM)
		switch (consentAccepted) {
			case TermsValidationStatus.TERMS_NOT_ACCEPTED:
				if (!hasSearchParam) return this.context.redirect(this.setSearchParam())
				return
			case TermsValidationStatus.TERMS_ACCEPTED:
				if (hasSearchParam) return this.context.redirect(this.delSearchParam())
				return
		}
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
	 * This method performs the following checks in order:
	 * 1. Retrieves the current version of terms from the service
	 * 2. If service call fails, returns ERROR
	 * 3. If no user is logged in, returns USER_NOT_LOGGED
	 * 4. Checks if user has accepted current version:
	 *    - If accepted, returns TERMS_ACCEPTED
	 *    - If not accepted, returns TERMS_NOT_ACCEPTED
	 *
	 * @returns Promise<Cases> - Returns the appropriate case indicating the terms validation status
	 */
	private async validateTerms(): Promise<TermsValidationState> {
		const response = await TermsService.getCurrentVersion()
		if (!response.success) {
			console.error(response.error)
			return TermsValidationStatus.ERROR
		}

		const { user } = this.context.locals
		if (!user) return TermsValidationStatus.USER_NOT_LOGGED

		const hasAcceptedCurrentVersion = user.dataConsent && user.dataConsent.version === response.data
		if (hasAcceptedCurrentVersion) {
			return TermsValidationStatus.TERMS_ACCEPTED
		}

		return TermsValidationStatus.TERMS_NOT_ACCEPTED
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

	/**
	 * Removes the showDialog search parameter from the current URL.
	 * Used when redirecting away from the terms dialog after terms are accepted.
	 * @returns The URL string without the showDialog parameter
	 */
	private delSearchParam() {
		const url: URL = this.context.url
		url.searchParams.delete(Auth.SEARCH_PARAM)
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
