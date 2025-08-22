package io.github.juniorcorzo.UrbanStyle.auth.application.service;

import io.github.juniorcorzo.UrbanStyle.user.domain.entities.UserEntity;
import io.github.juniorcorzo.UrbanStyle.user.domain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomerUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserEntity user = userRepository.findUserByEmail(email);

        return User
                .withUsername(email)
                .password(user.getPassword())
                .build();
    }
}
