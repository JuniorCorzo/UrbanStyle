package io.github.juniorcorzo.UrbanStyle.infrastructure.security;

import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.KeyLengthException;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.jwk.JWK;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.OctetSequenceKey;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
import com.nimbusds.jose.jwk.source.ImmutableSecret;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;
import io.github.juniorcorzo.UrbanStyle.application.service.CustomerUserDetailsService;
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
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.stereotype.Component;

import javax.crypto.spec.SecretKeySpec;

@Component
public class SecureBeans {
    private String SECRET_KEY = "MhRqw6K3l3cQYcFC5favpCyqpy1IJVn4";
    private final CustomerUserDetailsService customerUserDetailsService;

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
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(this.customerUserDetailsService);
        provider.setPasswordEncoder(passwordEncoder);

        return new ProviderManager(provider);
    }

    @Bean
    public JwtDecoder jwtDecoder() throws KeyLengthException {
        return NimbusJwtDecoder.withSecretKey(new SecretKeySpec(SECRET_KEY.getBytes(), "HmacSHA256")).build();
    }
}
