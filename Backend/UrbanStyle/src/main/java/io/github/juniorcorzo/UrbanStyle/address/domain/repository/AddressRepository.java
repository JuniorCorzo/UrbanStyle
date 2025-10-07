package io.github.juniorcorzo.UrbanStyle.address.domain.repository;

import io.github.juniorcorzo.UrbanStyle.address.domain.entities.AddressEntity;
import org.springframework.data.mongodb.repository.DeleteQuery;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.Update;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for managing {@link AddressEntity} data in MongoDB.
 */
public interface AddressRepository extends ListCrudRepository<AddressEntity, String> {
    /**
     * Finds all addresses associated with a specific user ID.
     *
     * @param userId The ID of the user.
     * @return An {@link Optional} containing a list of {@link AddressEntity}.
     */
    @Query("{ 'userId': ?0 }")
    Optional<List<AddressEntity>> findByUserId(String userId);

    /**
     * Deletes all addresses associated with a specific user ID.
     * This operation is transactional.
     *
     * @param userId The ID of the user whose addresses should be deleted.
     */
    @Transactional
    @DeleteQuery("{ 'userId': ?0 }")
    void deleteByUserId(String userId);
}
