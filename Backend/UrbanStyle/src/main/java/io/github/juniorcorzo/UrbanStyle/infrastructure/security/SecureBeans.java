package io.github.juniorcorzo.UrbanStyle.infrastructure.security;

import io.github.juniorcorzo.UrbanStyle.application.service.CustomerUserDetailsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;

import javax.crypto.spec.SecretKeySpec;

@Configuration
@Slf4j
@SuppressWarnings("unused")
public class SecureBeans {
    private final CustomerUserDetailsService customerUserDetailsService;
    @Value("${SECRET_KEY}")
    private String SECRET_KEY;

    public SecureBeans(@Lazy CustomerUserDetailsService customerUserDetailsService) {
        this.customerUserDetailsService = customerUserDetailsService;
    }

    /**
     * This method creates a PasswordEncoder bean that uses the DelegatingPasswordEncoder.
     * The DelegatingPasswordEncoder is a password encoder that delegates to different
     * password encoders based on the prefix of the encoded password.
     *
     * @return a PasswordEncoder bean
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }

    /**
     * This method creates an AuthenticationManager bean that uses a DaoAuthenticationProvider
     * to authenticate users. The DaoAuthenticationProvider uses the CustomerUserDetailsService
     * to load user details and the PasswordEncoder to encode passwords.
     *
     * @param passwordEncoder the PasswordEncoder bean
     * @return an AuthenticationManager bean
     */
    @Bean
    public AuthenticationManager authenticationManager(PasswordEncoder passwordEncoder) {
        log.info("Creating AuthenticationManager bean");
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(this.customerUserDetailsService);
        provider.setPasswordEncoder(passwordEncoder);

        return new ProviderManager(provider);
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        return NimbusJwtDecoder.withSecretKey(new SecretKeySpec(SECRET_KEY.getBytes(), "HmacSHA256")).build();
    }
}
