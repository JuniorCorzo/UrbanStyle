package io.github.juniorcorzo.UrbanStyle.infrastructure.controller;

import io.github.juniorcorzo.UrbanStyle.application.service.ProductService;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.common.ProductDTO;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.request.ProductImagesDTO;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.response.ResponseDTO;

import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/products")
public class ProductController {
    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/all")
    public ResponseDTO<ProductDTO> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping
    public ResponseDTO<ProductDTO> getProductById(@RequestParam String id) {
        return productService.getProductById(id);
    }

    @GetMapping("/{category}")
    public ResponseDTO<ProductDTO> getAllCategories(@PathVariable String category) {
        return productService.getProductsByCategory(category);
    }

    @GetMapping("/search")
    public ResponseDTO<ProductDTO> searchProducts(@RequestParam String search) {
        return productService.searchProducts(search);
    }

    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseDTO<ProductDTO> createProduct(@RequestBody ProductDTO productDTO) {
        return productService.createProduct(productDTO);
    }

    @PostMapping("/add-images")
    @ResponseStatus(HttpStatus.OK)
    public ResponseDTO<ProductDTO> addImages(@RequestBody @Validated ProductImagesDTO productDTO) {
        return this.productService.addImages(productDTO);
    }

    @PutMapping("/update")
    public ResponseDTO<ProductDTO> updateProduct(@RequestBody ProductDTO productDTO) {
        return productService.updateProduct(productDTO);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseDTO<ProductDTO> deleteProduct(@PathVariable String id) {
        return productService.deleteProduct(id);
    }

    @DeleteMapping("/delete-images")
    public ResponseDTO<ProductDTO> deleteImagesFromProduct(@RequestBody @Validated ProductImagesDTO productImagesDTO) {
        return productService.deleteImagesFromProduct(productImagesDTO);
    }
}
