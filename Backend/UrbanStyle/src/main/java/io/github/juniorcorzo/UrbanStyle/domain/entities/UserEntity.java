package io.github.juniorcorzo.UrbanStyle.domain.entities;

import io.github.juniorcorzo.UrbanStyle.domain.enums.Roles;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.index.IndexOptions;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;
import org.springframework.security.core.GrantedAuthority;

import java.time.LocalDateTime;

@Document("users")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserEntity implements GrantedAuthority {
    @MongoId
    private String id;
    private String name;
    @Indexed(unique = true)
    private String email;
    private String password;
    @Indexed(unique = true)
    private String avatar;
    private Roles role;
    private String phone;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Override
    public String getAuthority() {
        return this.role.name();
    }
}