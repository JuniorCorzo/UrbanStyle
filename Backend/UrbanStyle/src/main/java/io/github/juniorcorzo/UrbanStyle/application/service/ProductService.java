package io.github.juniorcorzo.UrbanStyle.application.service;

import io.github.juniorcorzo.UrbanStyle.domain.entities.ProductEntity;
import io.github.juniorcorzo.UrbanStyle.domain.repository.ProductsRepository;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.ProductDTO;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.ResponseDTO;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {
    private final ProductsRepository productsRepository;
    private final ModelMapper modelMapper;

    @Autowired
    public ProductService(ProductsRepository productsRepository) {
        this.productsRepository = productsRepository;
        modelMapper = new ModelMapper();
    }

    public ResponseDTO<ProductDTO> getAllProducts() {
        List<ProductDTO> products = productsRepository.findAll().stream().map(product -> modelMapper.map(product, ProductDTO.class)).toList();

        return new ResponseDTO<>(HttpStatus.OK, products, "Products retrieved successfully");
    }

    public ResponseDTO<ProductDTO> getProductsByCategory(String categoryId) {
        List<ProductDTO> products = productsRepository.findByCategory(categoryId).stream().map(product -> modelMapper.map(product, ProductDTO.class)).toList();
        return new ResponseDTO<>(HttpStatus.OK, products, "Products retrieved successfully");
    }

    public ResponseDTO<ProductDTO> createProduct(ProductDTO productDTO) {
        ProductEntity productEntity = modelMapper.map(productDTO, ProductEntity.class);
        ProductEntity savedProduct = productsRepository.save(productEntity);

        return new ResponseDTO<>(HttpStatus.CREATED, List.of(modelMapper.map(savedProduct, ProductDTO.class)), "Product created successfully");
    }

    public ResponseDTO<ProductDTO> updateProduct(ProductDTO productDTO) {
        ProductEntity productEntity = modelMapper.map(productDTO, ProductEntity.class);
        ProductEntity updatedProduct = productsRepository.save(productEntity);

        return new ResponseDTO<>(HttpStatus.OK, List.of(modelMapper.map(updatedProduct, ProductDTO.class)), "Product updated successfully");
    }

    public ResponseDTO<ProductDTO> deleteProduct(String id) {
        productsRepository.deleteById(id);
        return new ResponseDTO<>(HttpStatus.OK, "Product deleted successfully");
    }
}
