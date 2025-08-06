package io.github.juniorcorzo.UrbanStyle.domain.repository;

import io.github.juniorcorzo.UrbanStyle.domain.entities.UserEntity;
import io.github.juniorcorzo.UrbanStyle.domain.enums.Roles;
import io.github.juniorcorzo.UrbanStyle.domain.projections.ObtainPassword;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.Update;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository

public interface UserRepository extends MongoRepository<UserEntity, String> {
    @Query("{ 'email': ?0 }")
    UserEntity findUserByEmail(String email);

    @Query("{ '_id': ?0 }")
    Optional<ObtainPassword> findPasswordById(String userId);

    @Query("{ '_id': ?0 }")
    @Update("{ '$set': { 'role': ?1} }")
    void changeRole(String userId, Roles role);


    @Query("{'_id': ?#{[0].id} }")
    @Update(value = "{ '$set': { 'name': ?#{[0].name}, 'email': ?#{[0].email}, 'phone': ?#{[0].phone}, 'updatedAt': 'ISODate()' } }" )
    void updateUser(UserEntity user);

    @Query("{ '_id': ?0 }")
    @Update("{ '$set': { 'avatar': ?1 } }")
    void insertNewAvatar(String userId,String avatar);

    @Query("{ '_id': ?0 }")
    @Update("{ '$set': { 'password': ?1 } }")
    void changePassword(String userId, String newPassword);
}
