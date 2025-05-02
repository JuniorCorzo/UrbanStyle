package io.github.juniorcorzo.UrbanStyle.domain.entities;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

@Document("address")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddressEntity {
    @MongoId
    private String id;
    private String userId;
    private String street;
    private String city;
    private String state;
    private String country;
    private String postalCode;
}
