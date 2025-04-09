package io.github.juniorcorzo.UrbanStyle.application.service;

import io.github.juniorcorzo.UrbanStyle.domain.entities.CategoryEntity;
import io.github.juniorcorzo.UrbanStyle.domain.repository.CategoriesRepository;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.common.CategoryDTO;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.response.ResponseDTO;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.mapper.CategoriesMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoriesService {
    private final CategoriesRepository categoriesRepository;
    private final CategoriesMapper categoriesMapper;

    @Autowired
    public CategoriesService(CategoriesRepository categoriesRepository, CategoriesMapper categoriesMapper) {
        this.categoriesRepository = categoriesRepository;
        this.categoriesMapper = categoriesMapper;
    }

    public ResponseDTO<CategoryDTO> getAllCategories() {
        List<CategoryEntity> categories = this.categoriesRepository.findAll();
        List<CategoryDTO> categoryDTOs = categories.stream()
                .map(this.categoriesMapper::toDTO)
                .toList();

        return new ResponseDTO<>(
                HttpStatus.OK,
                categoryDTOs,
                "Categories retrieved successfully"
        );
    }

    public ResponseDTO<CategoryDTO> createCategory(CategoryDTO category) {
        CategoryEntity categoryEntity = this.categoriesMapper.toEntity(category);
        CategoryEntity savedCategory = this.categoriesRepository.save(categoryEntity);

        return new ResponseDTO<>(
                HttpStatus.CREATED,
                List.of(categoriesMapper.toDTO(savedCategory)),
                "Category created successfully"
        );
    }

    public ResponseDTO<CategoryDTO> updateCategory(CategoryDTO category) {
        CategoryEntity categoryEntity = this.categoriesMapper.toEntity(category);
        CategoryEntity updatedCategory = this.categoriesRepository.save(categoryEntity);

        return new ResponseDTO<>(
                HttpStatus.OK,
                List.of(this.categoriesMapper.toDTO(updatedCategory)),
                "Category updated successfully"
        );
    }

    public ResponseDTO<CategoryDTO> deleteCategory(String id) {
        this.categoriesRepository.deleteById(id);
        return new ResponseDTO<>(
                HttpStatus.OK,
                "Category deleted successfully"
        );
    }
}
