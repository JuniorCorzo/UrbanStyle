package io.github.juniorcorzo.UrbanStyle.domain.repository;

import io.github.juniorcorzo.UrbanStyle.domain.entities.CategoryEntity;
import org.springframework.data.repository.ListCrudRepository;

public interface CategoriesRepository extends ListCrudRepository<CategoryEntity, String> {
}
