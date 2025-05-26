package io.github.juniorcorzo.UrbanStyle.domain.entities;

import lombok.*;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

@Document("users")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserEntity {
    @MongoId
    private String id;
    private String name;
    @Indexed(unique = true)
    private String email;
    private String password;
    private String role;
    private String phone;
}