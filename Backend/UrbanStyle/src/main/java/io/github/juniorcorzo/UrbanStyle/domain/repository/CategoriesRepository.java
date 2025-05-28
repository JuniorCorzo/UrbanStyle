package io.github.juniorcorzo.UrbanStyle.domain.repository;

import io.github.juniorcorzo.UrbanStyle.domain.entities.CategoryEntity;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.repository.ListCrudRepository;

public interface CategoriesRepository extends ListCrudRepository<CategoryEntity, String> {

    @Query(value = "{_id: ?0}", fields = "{ name: 1, _id: 0 }")
    String findNameById(String id);
}
