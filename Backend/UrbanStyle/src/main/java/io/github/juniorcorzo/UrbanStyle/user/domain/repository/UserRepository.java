package io.github.juniorcorzo.UrbanStyle.user.domain.repository;

import io.github.juniorcorzo.UrbanStyle.common.domain.enums.Roles;
import io.github.juniorcorzo.UrbanStyle.product.domain.adapter.proyections.ObtainPassword;
import io.github.juniorcorzo.UrbanStyle.user.domain.entities.DataConsent;
import io.github.juniorcorzo.UrbanStyle.user.domain.entities.UserEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.Update;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface for managing {@link UserEntity} data in MongoDB.
 */
@Repository
public interface UserRepository extends MongoRepository<UserEntity, String> {
    /**
     * Finds a user by their email address.
     * @param email The email to search for.
     * @return The {@link UserEntity} found.
     */
    @Query("{ 'email': ?0 }")
    UserEntity findUserByEmail(String email);

    /**
     * Finds the password for a given user ID.
     * @param userId The ID of the user.
     * @return An {@link Optional} containing the user's password projection.
     */
    @Query("{ '_id': ?0 }")
    Optional<ObtainPassword> findPasswordById(String userId);

    /**
     * Changes the role of a user.
     * @param userId The ID of the user to update.
     * @param role The new role to assign.
     */
    @Query("{ '_id': ?0 }")
    @Update("{ '$set': { 'role': ?1} }")
    void changeRole(String userId, Roles role);


    /**
     * Updates user profile information.
     * @param user The {@link UserEntity} with updated information.
     */
    @Query("{'_id': ?#{[0].id} }")
    @Update(value = "{ '$set': { 'name': ?#{[0].name}, 'email': ?#{[0].email}, 'phone': ?#{[0].phone}, 'updatedAt': ?#{[0].updatedAt} } }")
    void updateUser(UserEntity user);

    /**
     * Updates the data consent information for a user.
     * @param userId The ID of the user to update.
     * @param dataConsent The new data consent information.
     */
    @Query("{ '_id': ?0 }")
    @Update("{ '$set': { 'dataConsent': ?1} }")
    void updateUserConsent(String userId, DataConsent dataConsent);

    /**
     * Inserts a new avatar for a user.
     * @param userId The ID of the user to update.
     * @param avatar The new avatar identifier.
     */
    @Query("{ '_id': ?0 }")
    @Update("{ '$set': { 'avatar': ?1 } }")
    void insertNewAvatar(String userId, String avatar);

    /**
     * Changes the password for a user.
     * @param userId The ID of the user to update.
     * @param newPassword The new encrypted password.
     */
    @Query("{ '_id': ?0 }")
    @Update("{ '$set': { 'password': ?1 } }")
    void changePassword(String userId, String newPassword);

    /**
     * Performs a soft delete on a user account.
     * This method sets the `isDeleted` flag to true, records the deletion reason and timestamp,
     * and unsets sensitive personal information.
     *
     * @param userId The ID of the user to delete.
     * @param reason The reason for the deletion.
     */
    @Query("{ '_id': ?0 }")
    @Update("""
            {
                '$set': {
                    'isDeleted': true,
                    'deletedReason': ?1,
                    'deletedAt': ?#{T(java.time.LocalDateTime).now()},
                },
                '$unset': {
                        'email': null,
                        'phone': null,
                        'avatar': null,
                        'password': null,
                },
            }
            """)
    void deleteById(String userId, String reason);
}
