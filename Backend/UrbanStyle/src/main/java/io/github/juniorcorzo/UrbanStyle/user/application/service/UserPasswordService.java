package io.github.juniorcorzo.UrbanStyle.user.application.service;

import io.github.juniorcorzo.UrbanStyle.common.domain.enums.DocumentsName;
import io.github.juniorcorzo.UrbanStyle.common.domain.exceptions.DocumentNotFound;
import io.github.juniorcorzo.UrbanStyle.product.domain.adapter.proyections.ObtainPassword;
import io.github.juniorcorzo.UrbanStyle.user.domain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserPasswordService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public boolean validatedPassword(String userId, String password) {
        final String userPassword = this.userRepository.findPasswordById(userId)
                .map(ObtainPassword::getPassword)
                .orElseThrow(() -> new DocumentNotFound(DocumentsName.USER, userId));

        return this.passwordEncoder.matches(password, userPassword);
    }

    public void changePassword(String userId, String oldPassword, String newPassword) {
        if (!this.validatedPassword(userId, oldPassword)) {
            throw new RuntimeException("password incorrect");
        }
        this.userRepository.changePassword(userId, passwordEncoder.encode(newPassword));
    }

    public String encodePassword(String password) {
        return this.passwordEncoder.encode(password);
    }
}
