package io.github.juniorcorzo.UrbanStyle.infrastructure.controller;

import io.github.juniorcorzo.UrbanStyle.application.service.ProductService;
import io.github.juniorcorzo.UrbanStyle.domain.annotations.constraint.IdFormatConstraint;
import io.github.juniorcorzo.UrbanStyle.domain.annotations.groups.OnCreate;
import io.github.juniorcorzo.UrbanStyle.domain.annotations.groups.OnUpdate;
import io.github.juniorcorzo.UrbanStyle.domain.dtos.ProductAggregationDomain;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.common.ProductDTO;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.request.ProductImagesDTO;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.response.ResponseDTO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
@SuppressWarnings("unused")
public class ProductController {
    private final ProductService productService;

    @GetMapping("/all")
    public ResponseDTO<ProductDTO> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping
    public ResponseDTO<ProductDTO> getProductById(@IdFormatConstraint @RequestParam String id) {
        return productService.getProductById(id);
    }

    @GetMapping("/group")
    public ResponseDTO<ProductAggregationDomain> groupProductsByCategories() {
        return this.productService.groupProductsByCategories();
    }

    @GetMapping("/{category}")
    public ResponseDTO<ProductDTO> getAllCategories(@NotBlank @PathVariable String category) {
        return productService.getProductsByCategory(category);
    }

    @GetMapping("/search")
    public ResponseDTO<ProductDTO> searchProducts(@NotBlank @RequestParam String search) {
        return productService.searchProducts(search);
    }

    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseDTO<ProductDTO> createProduct(@Validated(OnCreate.class) @RequestBody ProductDTO productDTO) {
        return productService.createProduct(productDTO);
    }

    @PostMapping("/add-images")
    @ResponseStatus(HttpStatus.OK)
    public ResponseDTO<ProductDTO> addImages(@Valid @RequestBody ProductImagesDTO productDTO) {
        return this.productService.addImages(productDTO);
    }

    @PutMapping("/update")
    public ResponseDTO<ProductDTO> updateProduct(@Validated(OnUpdate.class) @RequestBody ProductDTO productDTO) {
        return productService.updateProduct(productDTO);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseDTO<ProductDTO> deleteProduct(@IdFormatConstraint @PathVariable String id) {
        return productService.deleteProduct(id);
    }

    @DeleteMapping("/delete-images")
    public ResponseDTO<ProductDTO> deleteImagesFromProduct(@Valid @RequestBody ProductImagesDTO productImagesDTO) {
        return productService.deleteImagesFromProduct(productImagesDTO);
    }
}
