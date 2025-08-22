package io.github.juniorcorzo.UrbanStyle.category.infrastructure.controller;

import io.github.juniorcorzo.UrbanStyle.category.application.service.CategoriesService;
import io.github.juniorcorzo.UrbanStyle.common.domain.annotations.groups.OnCreate;
import io.github.juniorcorzo.UrbanStyle.common.domain.annotations.groups.OnUpdate;
import io.github.juniorcorzo.UrbanStyle.category.infrastructure.adapter.dto.CategoryDTO;
import io.github.juniorcorzo.UrbanStyle.common.infrastructure.adapter.dtos.response.ResponseDTO;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
@SuppressWarnings("unused")
public class CategoryController {
    private final CategoriesService categoryService;

    @GetMapping("/all")
    public ResponseDTO<CategoryDTO> getAllCategories() {
        return this.categoryService.getAllCategories();
    }

    @GetMapping("/description")
    public ResponseDTO<String> getDescriptionByName(@NotBlank @RequestParam String name) {
        return this.categoryService.getDescriptionByName(name);
    }

    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseDTO<CategoryDTO> createCategory(@Validated(OnCreate.class) @RequestBody CategoryDTO categoryDTO) {
        return this.categoryService.createCategory(categoryDTO);
    }

    @PutMapping("/update")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseDTO<CategoryDTO> updateCategory(@Validated(OnUpdate.class) @RequestBody CategoryDTO categoryDTO) {
        return this.categoryService.updateCategory(categoryDTO);
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseDTO<CategoryDTO> deleteCategory(@NotBlank @PathVariable String id) {
        return this.categoryService.deleteCategory(id);
    }
}
