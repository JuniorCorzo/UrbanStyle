package io.github.juniorcorzo.UrbanStyle.domain.entities;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

@Document("users")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserEntity {
    @Setter(AccessLevel.NONE)
    @MongoId
    private String id;
    private String name;
    private String email;
    private String password;
    private String role;
    private String phone;
}