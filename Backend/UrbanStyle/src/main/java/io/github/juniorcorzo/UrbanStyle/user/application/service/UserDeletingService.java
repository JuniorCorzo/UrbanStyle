package io.github.juniorcorzo.UrbanStyle.user.application.service;

import io.github.juniorcorzo.UrbanStyle.address.domain.repository.AddressRepository;
import io.github.juniorcorzo.UrbanStyle.common.infrastructure.adapter.dtos.response.ResponseDTO;
import io.github.juniorcorzo.UrbanStyle.user.domain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service responsible for handling the deletion of user accounts.
 */
@Service
@RequiredArgsConstructor
public class UserDeletingService {
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final UserAvatarService userAvatarService;

    /**
     * Performs a comprehensive deletion of a user's account and associated data.
     * This process includes:
     * 1. Soft-deleting the user record by unsetting personal information.
     * 2. Deleting all associated addresses.
     * 3. Deleting the user's avatar from storage.
     * The entire operation is transactional.
     *
     * @param userId The ID of the user to be deleted.
     * @param reason The reason for the deletion.
     * @return A {@link ResponseDTO} indicating the result of the operation.
     */
    @Transactional
    public ResponseDTO<Object> deleteUser(String userId, String reason) {
        this.userRepository.deleteById(userId, reason);
        this.addressRepository.deleteByUserId(userId);
        this.userAvatarService.deleteAvatar(userId);

        return new ResponseDTO<>(
                HttpStatus.OK,
                "User deleted successfully"
        );
    }
}
