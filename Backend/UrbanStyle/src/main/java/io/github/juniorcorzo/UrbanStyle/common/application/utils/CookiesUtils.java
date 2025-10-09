package io.github.juniorcorzo.UrbanStyle.common.application.utils;

import jakarta.servlet.http.HttpServletResponse;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;

import java.time.Duration;

/**
 * Utility class for creating and clearing HTTP cookies.
 * This class provides static methods to handle cookie operations in a centralized manner.
 */
@NoArgsConstructor(access = lombok.AccessLevel.PRIVATE)
public class CookiesUtils {

    /**
     * Creates an HTTP-only cookie and adds it to the HttpServletResponse.
     *
     * @param response The HttpServletResponse to which the cookie will be added.
     * @param cookieName The name of the cookie.
     * @param cookieValue The value of the cookie.
     * @param maxAgeInDays The maximum age of the cookie in days.
     * @return The modified HttpServletResponse with the new cookie header.
     */
    public static HttpServletResponse createCookie(HttpServletResponse response, String cookieName, String cookieValue, long maxAgeInDays) {
        ResponseCookie cookie = ResponseCookie.from(cookieName, cookieValue)
                .httpOnly(true)
                .maxAge(Duration.ofDays(maxAgeInDays))
                .path("/")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        return response;
    }

    /**
     * Clears a specified cookie by setting its max age to 0.
     *
     * @param response The HttpServletResponse to which the clearing cookie header will be added.
     * @param cookieName The name of the cookie to clear.
     * @return The modified HttpServletResponse with the cookie clearing header.
     */
    public static HttpServletResponse clearCookie(HttpServletResponse response, String cookieName) {
        response.addHeader(
                HttpHeaders.SET_COOKIE,
                ResponseCookie.from(cookieName, "")
                        .httpOnly(true)
                        .maxAge(0)
                        .path("/")
                        .build()
                        .toString()
        );
        return response;
    }

}
