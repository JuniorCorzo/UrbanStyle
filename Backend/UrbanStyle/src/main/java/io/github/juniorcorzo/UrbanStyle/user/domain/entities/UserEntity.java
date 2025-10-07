package io.github.juniorcorzo.UrbanStyle.user.domain.entities;

import io.github.juniorcorzo.UrbanStyle.common.domain.enums.Roles;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;
import org.springframework.security.core.GrantedAuthority;

import java.time.LocalDateTime;

/**
 * Represents a user in the system.
 * This entity stores user information, including credentials, profile data, and auditing fields.
 */
@Document("users")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserEntity implements GrantedAuthority {
    /**
     * The unique identifier for the user.
     */
    @MongoId
    private String id;
    /**
     * The full name of the user.
     */
    private String name;
    /**
     * The user's email address. It is indexed and must be unique.
     */
    @Indexed(unique = true)
    private String email;
    /**
     * The user's encrypted password.
     */
    private String password;
    /**
     * The filename or identifier for the user's avatar image.
     * Defaults to "default_profile.webp".
     */
    private String avatar = "default_profile.webp";
    /**
     * Stores data consent information provided by the user.
     */
    private DataConsent dataConsent;
    /**
     * The role of the user in the system (e.g., USER, ADMIN).
     */
    private Roles role;
    /**
     * The user's phone number.
     */
    private String phone;
    /**
     * Flag to indicate if the user account is soft-deleted.
     * Defaults to false.
     */
    private boolean isDeleted = false;
    /**
     * The reason provided for the user's deletion.
     */
    private String deletedReason;
    /**
     * The timestamp when the user was created.
     */
    @CreatedDate
    private LocalDateTime createdAt;
    /**
     * The timestamp when the user was last updated.
     */
    @LastModifiedDate
    private LocalDateTime updatedAt;
    /**
     * The timestamp when the user was soft-deleted.
     */
    private LocalDateTime deletedAt;

    /**
     * Returns the user's role as a string for Spring Security.
     * @return The name of the user's role.
     */
    @Override
    public String getAuthority() {
        return this.role.name();
    }
}