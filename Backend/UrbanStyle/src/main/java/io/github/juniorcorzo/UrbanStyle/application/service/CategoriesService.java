package io.github.juniorcorzo.UrbanStyle.application.service;

import io.github.juniorcorzo.UrbanStyle.application.service.bulks.BulkCategoryService;
import io.github.juniorcorzo.UrbanStyle.domain.entities.CategoryEntity;
import io.github.juniorcorzo.UrbanStyle.domain.enums.DocumentsName;
import io.github.juniorcorzo.UrbanStyle.domain.exceptions.DeleteDocumentFailed;
import io.github.juniorcorzo.UrbanStyle.domain.exceptions.SaveDocumentFailed;
import io.github.juniorcorzo.UrbanStyle.domain.repository.CategoriesRepository;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.common.CategoryDTO;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.response.ResponseDTO;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.mapper.CategoriesMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class CategoriesService {
    private final CategoriesRepository categoriesRepository;
    private final CategoriesMapper categoriesMapper;
    private final BulkCategoryService bulkCategoryService;

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
        try {
            CategoryEntity categoryEntity = this.categoriesMapper.toEntity(category);
            CategoryEntity savedCategory = this.categoriesRepository.save(categoryEntity);

            return new ResponseDTO<>(
                    HttpStatus.CREATED,
                    List.of(categoriesMapper.toDTO(savedCategory)),
                    "Category created successfully"
            );
        } catch (Exception e) {
            log.error("Error creating category", e);
            throw new SaveDocumentFailed(DocumentsName.CATEGORY);
        }
    }

    public ResponseDTO<CategoryDTO> updateCategory(CategoryDTO category) {
        CategoryEntity categoryEntity = this.categoriesMapper.toEntity(category);
        try {
            if (this.categoriesRepository.findNameById(category.id()).equals(category.name())) {
                CategoryEntity updatedCategory = this.categoriesRepository.save(categoryEntity);
                return new ResponseDTO<>(
                        HttpStatus.OK,
                        List.of(this.categoriesMapper.toDTO(updatedCategory)),
                        "Category updated successfully"
                );
            }

            CategoryDTO updatedCategory = this.bulkCategoryService.updateCategory(categoryEntity);

            return new ResponseDTO<>(
                    HttpStatus.OK,
                    List.of(updatedCategory),
                    "Category updated successfully"
            );
        } catch (Exception e) {
            log.error("Error updating category", e);
            throw new SaveDocumentFailed(DocumentsName.CATEGORY);
        }
    }

    public ResponseDTO<CategoryDTO> deleteCategory(String id) {
        try {
            this.categoriesRepository.deleteById(id);
            return new ResponseDTO<>(
                    HttpStatus.OK,
                    "Category deleted successfully"
            );
        } catch (Exception e) {
            log.error("Error deleting category", e);
            throw new DeleteDocumentFailed(DocumentsName.CATEGORY, id);
        }
    }
}
