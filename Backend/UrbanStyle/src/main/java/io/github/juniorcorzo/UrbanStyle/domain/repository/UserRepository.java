package io.github.juniorcorzo.UrbanStyle.domain.repository;

import io.github.juniorcorzo.UrbanStyle.domain.entities.UserEntity;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends ListCrudRepository<UserEntity, String> {
    @Query("{ 'email': ?0 }")
    UserEntity findUserByEmail(String email);
}
