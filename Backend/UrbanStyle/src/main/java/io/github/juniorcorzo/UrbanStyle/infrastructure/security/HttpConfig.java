package io.github.juniorcorzo.UrbanStyle.infrastructure.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class HttpConfig {
    private  final JwtCookieFilter jwtCookieFilter;

    public HttpConfig(JwtCookieFilter jwtCookieFilter) {
        this.jwtCookieFilter = jwtCookieFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors((cors) -> cors.configurationSource(corsConfiguration()))
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests((auth) -> {
                            auth
                                    .requestMatchers("/auth/login").permitAll()
                                    .requestMatchers(HttpMethod.GET, "/**").permitAll()
                                    .requestMatchers(HttpMethod.POST, "/users/create").permitAll();

                            auth.anyRequest().authenticated();
                        }
                )
                .oauth2ResourceServer(oauth -> oauth.jwt(Customizer.withDefaults()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtCookieFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    CorsConfigurationSource corsConfiguration() {
        CorsConfiguration corsConfig = new CorsConfiguration();
        corsConfig.setAllowedOrigins(List.of("http://localhost:4321/"));
        corsConfig.setAllowedMethods(List.of("GET", "PUT", "POST", "DELETE", "OPTIONS"));
        corsConfig.setAllowedHeaders(List.of("Origin", "Content-Type", "Accept", "Authorization", "X-Requested-With"));
        corsConfig.setExposedHeaders(List.of("Authorization", "X-Requested-With", "Access-Control-Allow-Origin", "Access-Control-Allow-Credentials"));
        corsConfig.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);
        return source;
    }
}
