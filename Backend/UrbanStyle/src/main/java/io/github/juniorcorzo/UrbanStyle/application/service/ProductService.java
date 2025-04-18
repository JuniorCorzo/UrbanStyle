package io.github.juniorcorzo.UrbanStyle.application.service;

import io.github.juniorcorzo.UrbanStyle.domain.clients.StorageFileClient;
import io.github.juniorcorzo.UrbanStyle.domain.entities.ProductEntity;
import io.github.juniorcorzo.UrbanStyle.domain.repository.ProductsRepository;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.common.ProductDTO;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.response.ResponseDTO;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.mapper.ProductMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Service
public class ProductService {
    private final ProductsRepository productsRepository;
    private final ProductMapper productMapper;
    private final StorageFileClient storageFileClient;
    private final ImageProcessingService imageProcessingService;

    @Autowired
    public ProductService(ProductsRepository productsRepository, ProductMapper productMapper, @Lazy StorageFileClient storageFileClient, ImageProcessingService imageProcessingService) {
        this.productsRepository = productsRepository;
        this.productMapper = productMapper;
        this.storageFileClient = storageFileClient;
        this.imageProcessingService = imageProcessingService;
    }

    public ResponseDTO<ProductDTO> getAllProducts() {
        List<ProductDTO> products = this.productsRepository.findAll()
                .stream()
                .map(this.productMapper::toDTO)
                .toList();

        return new ResponseDTO<>(HttpStatus.OK, products, "Products retrieved successfully");
    }

    public ResponseDTO<ProductDTO> getProductById(String id) {
        ProductEntity productResponse = this.productsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        return new ResponseDTO<>(HttpStatus.OK, List.of(this.productMapper.toDTO(productResponse)), "Product retrieved successfully");
    }

    public ResponseDTO<ProductDTO> getProductsByCategory(String categoryId) {
        List<ProductDTO> products = this.productsRepository.findByCategory(categoryId)
                .stream()
                .map(this.productMapper::toDTO)
                .toList();

        return new ResponseDTO<>(HttpStatus.OK, products, "Products retrieved successfully");
    }

    public ResponseDTO<ProductDTO> createProduct(ProductDTO productDTO) {
        ProductEntity productEntity = this.productMapper.toEntity(productDTO);

        String urlImage = this.storageFileClient.uploadImage(this.imageProcessingService.convertToWebp(productDTO.images().getFirst().split(",")[1]));

        productEntity.setImages(Collections.singletonList(urlImage));
        ProductEntity savedProduct = this.productsRepository.save(productEntity);

        return new ResponseDTO<>(HttpStatus.CREATED, List.of(this.productMapper.toDTO(savedProduct)), "Product created successfully");
    }

    public ResponseDTO<ProductDTO> updateProduct(ProductDTO productDTO) {
        ProductEntity productEntity = this.productMapper.toEntity(productDTO);
        ProductEntity updatedProduct = this.productsRepository.save(productEntity);

        return new ResponseDTO<>(HttpStatus.OK, List.of(this.productMapper.toDTO(updatedProduct)), "Product updated successfully");
    }

    public ResponseDTO<ProductDTO> deleteProduct(String id) {
        this.productsRepository.deleteById(id);
        return new ResponseDTO<>(HttpStatus.OK, "Product deleted successfully");
    }
}
