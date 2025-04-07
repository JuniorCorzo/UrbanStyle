package io.github.juniorcorzo.UrbanStyle.application.service;

import io.github.juniorcorzo.UrbanStyle.domain.entities.CategoryEntity;
import io.github.juniorcorzo.UrbanStyle.domain.repository.CategoriesRepository;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.CategoryDTO;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.ResponseDTO;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoriesService {
    private final CategoriesRepository categoriesRepository;
    private final ModelMapper modelMapper;

    @Autowired
    public CategoriesService(CategoriesRepository categoriesRepository) {
        this.categoriesRepository = categoriesRepository;
        modelMapper = new ModelMapper();
    }

    public ResponseDTO<CategoryDTO> getAllCategories() {
        List<CategoryEntity> categories = this.categoriesRepository.findAll();
        List<CategoryDTO> categoryDTOs = categories.stream()
                .map(category -> modelMapper.map(category, CategoryDTO.class))
                .toList();

        return new ResponseDTO<>(
                HttpStatus.OK,
                categoryDTOs,
                "Categories retrieved successfully"
        );
    }

    public ResponseDTO<CategoryDTO> createCategory(CategoryDTO category) {
        CategoryEntity categoryEntity = this.modelMapper.map(category, CategoryEntity.class);
        CategoryEntity savedCategory = this.categoriesRepository.save(categoryEntity);

        return new ResponseDTO<>(
                HttpStatus.CREATED,
                List.of(modelMapper.map(savedCategory, CategoryDTO.class)),
                "Category created successfully"
        );
    }

    public ResponseDTO<CategoryDTO> updateCategory(CategoryDTO category) {
        CategoryEntity categoryEntity = this.modelMapper.map(category, CategoryEntity.class);
        CategoryEntity updatedCategory = this.categoriesRepository.save(categoryEntity);

        return new ResponseDTO<>(
                HttpStatus.OK,
                List.of(modelMapper.map(updatedCategory, CategoryDTO.class)),
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
