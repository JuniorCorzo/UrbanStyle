package io.github.juniorcorzo.UrbanStyle.domain.repository;

import io.github.juniorcorzo.UrbanStyle.domain.entities.UserEntity;
import io.github.juniorcorzo.UrbanStyle.domain.enums.Roles;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.Update;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends MongoRepository<UserEntity, String> {
    @Query("{ 'email': ?0 }")
    UserEntity findUserByEmail(String email);

    @Query("{ '_id': ?0 }")
    @Update("{ '$set': { 'role': ?1} }")
    void changeRole(String userId, Roles role);

    @Query("{'_id': ?#{[0].id} }")
    @Update(value = "{ '$set': { 'name': ?#{[0].name}, 'email': ?#{[0].email}, 'phone': ?#{[0].phone} } }" )
    void updateUser(UserEntity user);
}
