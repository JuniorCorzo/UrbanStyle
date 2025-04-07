package io.github.juniorcorzo.UrbanStyle.infrastructure.controller;

import io.github.juniorcorzo.UrbanStyle.application.service.CategoriesService;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.CategoryDTO;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.ResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/categories")
public class CategoryController {
    private final CategoriesService categoryService;

    @Autowired
    public CategoryController(CategoriesService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping("/all")
    public ResponseDTO<CategoryDTO> getAllCategories() {
        return this.categoryService.getAllCategories();
    }

    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseDTO<CategoryDTO> createCategory(@RequestBody CategoryDTO categoryDTO) {
        return this.categoryService.createCategory(categoryDTO);
    }

    @PutMapping("/update")
    public ResponseDTO<CategoryDTO> updateCategory(@RequestBody CategoryDTO categoryDTO) {
        return this.categoryService.updateCategory(categoryDTO);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseDTO<CategoryDTO> deleteCategory(@PathVariable String id) {
        return this.categoryService.deleteCategory(id);
    }
}
