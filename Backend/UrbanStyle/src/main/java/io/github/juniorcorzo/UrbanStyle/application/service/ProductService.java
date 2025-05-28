package io.github.juniorcorzo.UrbanStyle.application.service;

import io.github.juniorcorzo.UrbanStyle.domain.dtos.ProductAggregationDomain;
import io.github.juniorcorzo.UrbanStyle.domain.entities.ProductEntity;
import io.github.juniorcorzo.UrbanStyle.domain.repository.ProductsRepository;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.common.ProductDTO;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.request.ProductImagesDTO;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.response.ResponseDTO;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.mapper.ProductMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class ProductService {
    private final ProductsRepository productsRepository;
    private final ProductMapper productMapper;
    private final ImageStorageService imageStorageService;
    private final BulkProductService bulkProductService;


    public ResponseDTO<ProductDTO> getAllProducts() {
        List<ProductDTO> products = this.productsRepository.findAll()
                .stream()
                .map(this.productMapper::toDTO)
                .toList();

        return new ResponseDTO<>(
                HttpStatus.OK,
                products,
                "Products retrieved successfully"
        );
    }

    public ResponseDTO<ProductDTO> getProductById(String id) {
        ProductEntity productResponse = this.productsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        return new ResponseDTO<>(
                HttpStatus.OK,
                List.of(this.productMapper.toDTO(productResponse)),
                "Product retrieved successfully"
        );
    }

    public ResponseDTO<ProductAggregationDomain> groupProductsByCategories() {
        return new ResponseDTO<>(HttpStatus.OK, this.productsRepository.groupAllByCategories(), "Product retrieved successfully");
    }

    public ResponseDTO<ProductDTO> getProductsByCategory(String categoryId) {
        List<ProductDTO> products = this.productsRepository.findByCategory(categoryId)
                .stream()
                .map(this.productMapper::toDTO)
                .toList();

        return new ResponseDTO<>(
                HttpStatus.OK,
                products,
                "Products retrieved successfully"
        );
    }

    public ResponseDTO<ProductDTO> searchProducts(String search) {
        List<ProductDTO> products = this.productsRepository.searchProducts(search)
                .stream()
                .map(this.productMapper::toDTO)
                .toList();

        return new ResponseDTO<>(
                HttpStatus.OK,
                products,
                "Products retrieved successfully"
        );
    }

    public ResponseDTO<ProductDTO> createProduct(ProductDTO productDTO) {
        ProductEntity productEntity = this.productMapper.toEntity(productDTO);
        List<String> futureImages = this.imageStorageService.sendImagesToStorage(productDTO.images());
        productEntity.setImages(futureImages);

        ProductEntity savedProduct = this.productsRepository.save(productEntity);
        return new ResponseDTO<>(
                HttpStatus.CREATED,
                List.of(this.productMapper.toDTO(savedProduct)),
                "Product created successfully"
        );
    }

    public ResponseDTO<ProductDTO> addImages(ProductImagesDTO productImagesDTO) {
        List<String> keyImages = this.imageStorageService.sendImagesToStorage(productImagesDTO.images());
        this.productsRepository.saveImagesToProduct(productImagesDTO.productId(), keyImages);

        return new ResponseDTO<>(HttpStatus.OK, "Images added successfully");
    }

    public ResponseDTO<ProductDTO> updateProduct(ProductDTO productDTO) {

        ProductEntity productEntity = this.productMapper.toEntity(productDTO);
        String name = this.productsRepository.findById(productDTO.id()).orElseThrow().getName();

        if (productDTO.name().equals(name)) {
            ProductEntity updatedProduct = this.productsRepository.save(productEntity);
            return new ResponseDTO<>(HttpStatus.OK, List.of(this.productMapper.toDTO(updatedProduct)), "Product updated successfully");
        }


        ProductDTO updatedProduct = this.bulkProductService.updateProduct(productEntity);
        return new ResponseDTO<>(HttpStatus.OK, List.of(updatedProduct), "Product` updated successfully");
    }

    public ResponseDTO<ProductDTO> deleteProduct(String id) {
        List<String> images = this.productsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"))
                .getImages();

        this.productsRepository.deleteById(id);
        this.imageStorageService.deleteImagesFromStorage(images);
        return new ResponseDTO<>(HttpStatus.OK, "Product deleted successfully");
    }

    public ResponseDTO<ProductDTO> deleteImagesFromProduct(ProductImagesDTO productImagesDTO) {
        this.imageStorageService.deleteImagesFromStorage(productImagesDTO.images());
        this.productsRepository.deleteImagesFromProduct(productImagesDTO.productId(), productImagesDTO.images());
        return new ResponseDTO<>(HttpStatus.OK, "Images deleted successfully");
    }
}
