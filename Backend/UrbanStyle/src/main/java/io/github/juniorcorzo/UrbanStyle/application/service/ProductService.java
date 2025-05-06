package io.github.juniorcorzo.UrbanStyle.application.service;

import io.github.juniorcorzo.UrbanStyle.domain.dtos.ProductAggregationDomain;
import io.github.juniorcorzo.UrbanStyle.domain.entities.ProductEntity;
import io.github.juniorcorzo.UrbanStyle.domain.repository.ProductsRepository;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.common.ProductDTO;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.request.ProductImagesDTO;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.response.ResponseDTO;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.mapper.ProductMapper;
import org.apache.catalina.connector.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;

@Service
public class ProductService {
    private final ProductsRepository productsRepository;
    private final ProductMapper productMapper;
    private final ImageStorageService imageStorageService;

    @Autowired
    public ProductService(ProductsRepository productsRepository, ProductMapper productMapper, ImageStorageService imageStorageService) {
        this.productsRepository = productsRepository;
        this.productMapper = productMapper;
        this.imageStorageService = imageStorageService;
    }

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

    public ResponseDTO<ProductAggregationDomain> groupProductsByCategories(){
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
        try {
            Future<List<String>> futureImages = this.imageStorageService.sendImagesToStorage(productDTO.images());
            productEntity.setImages(futureImages.get());
            System.out.println(productEntity.getImages());
            ProductEntity savedProduct = this.productsRepository.save(productEntity);
            return new ResponseDTO<>(
                    HttpStatus.CREATED,
                    List.of(this.productMapper.toDTO(savedProduct)),
                    "Product created successfully"
            );
        } catch (InterruptedException | ExecutionException e) {
            throw new RuntimeException(e);
        }
    }

    public ResponseDTO<ProductDTO> addImages(ProductImagesDTO productImagesDTO) {
        try {
            List<String> keyImages = this.imageStorageService.sendImagesToStorage(productImagesDTO.images()).get();
            this.productsRepository.saveImagesToProduct(productImagesDTO.productId(), keyImages);

            return new ResponseDTO<>(HttpStatus.OK, "Images added successfully");
        } catch (InterruptedException | ExecutionException e) {
            throw new RuntimeException(e);
        }
    }

    public ResponseDTO<ProductDTO> updateProduct(ProductDTO productDTO) {
        ProductEntity productEntity = this.productMapper.toEntity(productDTO);
        ProductEntity updatedProduct = this.productsRepository.save(productEntity);

        return new ResponseDTO<>(HttpStatus.OK, List.of(this.productMapper.toDTO(updatedProduct)), "Product updated successfully");
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
        System.out.println(productImagesDTO);
        this.productsRepository.deleteImagesFromProduct(productImagesDTO.productId(), productImagesDTO.images());
        return new ResponseDTO<>(HttpStatus.OK, "Images deleted successfully");
    }
}
