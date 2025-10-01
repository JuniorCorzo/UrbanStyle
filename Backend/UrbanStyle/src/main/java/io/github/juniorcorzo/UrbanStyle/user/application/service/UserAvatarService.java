package io.github.juniorcorzo.UrbanStyle.user.application.service;

import io.github.juniorcorzo.UrbanStyle.product.application.service.ImageStorageService;
import io.github.juniorcorzo.UrbanStyle.user.domain.entities.UserEntity;
import io.github.juniorcorzo.UrbanStyle.user.domain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.Nullable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserAvatarService {

    private final UserRepository userRepository;
    private final ImageStorageService imageStorageService;

    public void changeAvatar(String userId, String avatar) {
        Optional<String> oldAvatarOpt = userRepository.findById(userId).map(UserEntity::getAvatar);

        final String avatarIdStorage = this.sendAvatarToStorage(avatar);
        this.userRepository.insertNewAvatar(userId, avatarIdStorage);

        oldAvatarOpt.ifPresent(oldAvatar -> {
            if(oldAvatar != null && !oldAvatar.equals("default_profile.webp")) {
                imageStorageService.deleteImagesFromStorage(List.of(oldAvatar));
            }
        });
    }

    public void deleteAvatar(String userId) {
        userRepository
                .findById(userId)
                .map(UserEntity::getAvatar)
                .ifPresent(avatarId -> {
                    if(avatarId != null && !avatarId.equals("default_profile.webp")){
                        this.imageStorageService.deleteImagesFromStorage(List.of(avatarId));
                    }
                });

        this.userRepository.insertNewAvatar(userId, "default_profile.webp");
    }

    @Nullable
    public String sendAvatarToStorage(@Nullable String avatar) {
        if (avatar == null || avatar.isBlank()) {
            return null;
        }
        return this.imageStorageService.sendImageToStorage(avatar);
    }
}
