package io.github.juniorcorzo.UrbanStyle.infrastructure.controller;

import io.github.juniorcorzo.UrbanStyle.application.service.CategoriesService;
import io.github.juniorcorzo.UrbanStyle.domain.annotations.groups.OnCreate;
import io.github.juniorcorzo.UrbanStyle.domain.annotations.groups.OnUpdate;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.common.CategoryDTO;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.response.ResponseDTO;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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

    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseDTO<CategoryDTO> createCategory(@Validated(OnCreate.class) @RequestBody CategoryDTO categoryDTO) {
        return this.categoryService.createCategory(categoryDTO);
    }

    @PutMapping("/update")
    public ResponseDTO<CategoryDTO> updateCategory(@Validated(OnUpdate.class) @RequestBody CategoryDTO categoryDTO) {
        return this.categoryService.updateCategory(categoryDTO);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseDTO<CategoryDTO> deleteCategory(@NotBlank @PathVariable String id) {
        return this.categoryService.deleteCategory(id);
    }
}
