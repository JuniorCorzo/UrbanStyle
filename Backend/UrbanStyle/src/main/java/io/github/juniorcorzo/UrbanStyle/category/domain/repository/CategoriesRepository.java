package io.github.juniorcorzo.UrbanStyle.category.domain.repository;

import io.github.juniorcorzo.UrbanStyle.category.domain.entities.CategoryEntity;
import org.bson.Document;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.repository.ListCrudRepository;

import java.util.Optional;

public interface CategoriesRepository extends ListCrudRepository<CategoryEntity, String> {
    @Query(value = "{_id: ?0}", fields = "{ name: 1, _id: 0 }")
    String findNameById(String id);

    @Query(value = "{name: ?0}", fields = "{ _id: 0, description: 1 }")
    Optional<Document> findDescriptionByName(String name);
}
