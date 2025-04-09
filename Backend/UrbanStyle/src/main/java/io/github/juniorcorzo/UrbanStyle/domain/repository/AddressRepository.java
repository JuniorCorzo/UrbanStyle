package io.github.juniorcorzo.UrbanStyle.domain.repository;

import io.github.juniorcorzo.UrbanStyle.domain.entities.AddressEntity;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.repository.ListCrudRepository;

import java.util.List;

public interface AddressRepository extends ListCrudRepository<AddressEntity, String> {
    @Query("{ 'userId': ?0 }")
    List<AddressEntity> findByUserId(String userId);
}
