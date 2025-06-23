package io.github.juniorcorzo.UrbanStyle.application.service;

import io.github.juniorcorzo.UrbanStyle.application.service.bulks.BulkProductService;
import io.github.juniorcorzo.UrbanStyle.domain.dtos.ProductAggregationDomain;
import io.github.juniorcorzo.UrbanStyle.domain.entities.ProductEntity;
import io.github.juniorcorzo.UrbanStyle.domain.enums.DocumentsName;
import io.github.juniorcorzo.UrbanStyle.domain.exceptions.DeleteDocumentFailed;
import io.github.juniorcorzo.UrbanStyle.domain.exceptions.DocumentNotFound;
import io.github.juniorcorzo.UrbanStyle.domain.exceptions.SaveDocumentFailed;
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
                .orElseThrow(() -> new DocumentNotFound(DocumentsName.PRODUCT, id));

        return new ResponseDTO<>(
                HttpStatus.OK,
                List.of(this.productMapper.toDTO(productResponse)),
                "Product retrieved successfully"
        );
    }

    public ResponseDTO<ProductAggregationDomain> groupProductsByCategories() {
        List<ProductAggregationDomain> productsGroupedByCategories = this.productsRepository
                .groupAllByCategories();

        return new ResponseDTO<>(
                HttpStatus.OK,
                productsGroupedByCategories,
                "Product retrieved successfully"
        );
    }

    public ResponseDTO<ProductDTO> getProductsByCategory(String categoryName) {
        List<ProductDTO> products = this.productsRepository.findByCategory(categoryName)
                .orElseThrow(() -> new DocumentNotFound(DocumentsName.CATEGORY, categoryName))
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
        int stock = productEntity.getAttributes().stream().reduce(0, (acc, attribute) -> acc + attribute.getQuantity(), Integer::sum);
        productEntity.setStock(stock);
        productEntity.setImages(futureImages);

        try {
            ProductEntity savedProduct = this.productsRepository.save(productEntity);
            return new ResponseDTO<>(
                    HttpStatus.CREATED,
                    List.of(this.productMapper.toDTO(savedProduct)),
                    "Product created successfully"
            );
        } catch (Exception e) {
            log.error("Error creating product", e);
            throw new SaveDocumentFailed(DocumentsName.PRODUCT);
        }
    }

    public ResponseDTO<ProductDTO> addImages(ProductImagesDTO productImagesDTO) {
        try {
            List<String> keyImages = this.imageStorageService.sendImagesToStorage(productImagesDTO.images());
            this.productsRepository.saveImagesToProduct(productImagesDTO.productId(), keyImages);

            return new ResponseDTO<>(HttpStatus.OK, "Images added successfully");
        } catch (RuntimeException e) {
            log.error("Failed adding images to product with id {}", productImagesDTO.productId(), e);
            throw new SaveDocumentFailed(DocumentsName.IMAGES);
        }
    }

    public ResponseDTO<ProductDTO> updateProduct(ProductDTO productDTO) {
        ProductEntity productEntity = this.productMapper.toEntity(productDTO);
        try {
            if (this.productsRepository.findNameById(productDTO.id()).equals(productDTO.name())) {
                ProductEntity updatedProduct = this.productsRepository.save(productEntity);
                return new ResponseDTO<>(HttpStatus.OK, List.of(this.productMapper.toDTO(updatedProduct)), "Product updated successfully");
            }


            ProductDTO updatedProduct = this.bulkProductService.updateProduct(productEntity);
            return new ResponseDTO<>(HttpStatus.OK, List.of(updatedProduct), "Product` updated successfully");
        } catch (Exception e) {
            log.error("Error updating product", e);
            throw new SaveDocumentFailed(DocumentsName.PRODUCT);
        }
    }

    public ResponseDTO<ProductDTO> deleteProduct(String id) {
        try {

            List<String> images = this.productsRepository.findById(id)
                    .orElseThrow(() -> new DocumentNotFound(DocumentsName.PRODUCT, id))
                    .getImages();

            this.productsRepository.deleteById(id);
            this.imageStorageService.deleteImagesFromStorage(images);
            return new ResponseDTO<>(HttpStatus.OK, "Product deleted successfully");
        } catch (RuntimeException e) {
            log.error("Error deleting product", e);
            throw new DeleteDocumentFailed(DocumentsName.PRODUCT, id);
        }
    }

    public ResponseDTO<ProductDTO> deleteImagesFromProduct(ProductImagesDTO productImagesDTO) {
        try {

            this.imageStorageService.deleteImagesFromStorage(productImagesDTO.images());
            this.productsRepository.deleteImagesFromProduct(productImagesDTO.productId(), productImagesDTO.images());
            return new ResponseDTO<>(HttpStatus.OK, "Images deleted successfully");
        } catch (RuntimeException e) {
            log.error("Error deleting images from product", e);
            throw new DeleteDocumentFailed(DocumentsName.IMAGES, productImagesDTO.productId());
        }
    }
}
