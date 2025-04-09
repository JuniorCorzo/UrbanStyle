package io.github.juniorcorzo.UrbanStyle.infrastructure.controller;

import io.github.juniorcorzo.UrbanStyle.application.service.ProductService;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.common.ProductDTO;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.response.ResponseDTO;
import org.springframework.http.HttpStatus;
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

    @GetMapping("/{category}")
    public ResponseDTO<ProductDTO> getAllCategories(@PathVariable String category) {
        return productService.getProductsByCategory(category);
    }

    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseDTO<ProductDTO> createProduct(@RequestBody ProductDTO productDTO) {
        return productService.createProduct(productDTO);
    }
    @PutMapping("/update")
    public ResponseDTO<ProductDTO> updateProduct(@RequestBody ProductDTO productDTO) {
        return productService.updateProduct(productDTO);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseDTO<ProductDTO> deleteProduct(@PathVariable String id) {
        return productService.deleteProduct(id);
    }

}
