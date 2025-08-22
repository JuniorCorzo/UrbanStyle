package io.github.juniorcorzo.UrbanStyle.product.application.service;

import io.github.juniorcorzo.UrbanStyle.common.domain.enums.DocumentsName;
import io.github.juniorcorzo.UrbanStyle.common.domain.exceptions.DeleteDocumentFailed;
import io.github.juniorcorzo.UrbanStyle.common.domain.exceptions.DocumentNotFound;
import io.github.juniorcorzo.UrbanStyle.common.domain.exceptions.SaveDocumentFailed;
import io.github.juniorcorzo.UrbanStyle.common.infrastructure.adapter.dtos.response.ResponseDTO;
import io.github.juniorcorzo.UrbanStyle.product.application.service.bulks.BulkProductService;
import io.github.juniorcorzo.UrbanStyle.product.application.utils.AttributesManageUtils;
import io.github.juniorcorzo.UrbanStyle.product.application.utils.ProductUtils;
import io.github.juniorcorzo.UrbanStyle.product.domain.adapter.dtos.Images;
import io.github.juniorcorzo.UrbanStyle.product.domain.entities.ProductEntity;
import io.github.juniorcorzo.UrbanStyle.product.domain.repository.ProductsRepository;
import io.github.juniorcorzo.UrbanStyle.product.infrastructure.adapters.dto.common.ProductDTO;
import io.github.juniorcorzo.UrbanStyle.product.infrastructure.adapters.mappers.ProductMapper;
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
    private final ProductStockService productStockService;
    private final ImageStorageService imageStorageService;
    private final BulkProductService bulkProductService;
    private final ProductMapper productMapper;


    public ResponseDTO<ProductDTO> getProductById(String id) {
        ProductEntity productResponse = this.productsRepository
                .findById(id)
                .orElseThrow(() -> new DocumentNotFound(DocumentsName.PRODUCT, id));

        return new ResponseDTO<>(HttpStatus.OK, List.of(this.productMapper.toDTO(productResponse)),
                "Product retrieved successfully");
    }

    public ResponseDTO<ProductDTO> createProduct(ProductDTO productDTO) {
        final ProductEntity productEntity = this.productMapper.toEntity(productDTO);
        final List<Images> futureImages = this.imageStorageService.sendImagesToStorage(productDTO.images());
        int stock = ProductUtils.getTotalStock(productEntity.getAttributes());
        productEntity.setStock(stock);
        productEntity.setImages(futureImages);

        AttributesManageUtils.setAttributesSku(productEntity);

        try {
            ProductEntity savedProduct = this.productsRepository.save(productEntity);

            return new ResponseDTO<>(HttpStatus.CREATED, List.of(this.productMapper.toDTO(savedProduct)),
                    "Product created successfully");
        } catch (Exception e) {
            log.error("Error creating product", e);
            throw new SaveDocumentFailed(DocumentsName.PRODUCT);
        }
    }

    public ResponseDTO<ProductDTO> updateProduct(ProductDTO productDTO) {
        ProductEntity productEntity = this.productMapper.toEntity(productDTO);
        productEntity.setStock(
                ProductUtils.getTotalStock(productEntity.getAttributes())
        );

        AttributesManageUtils.setAttributesSku(productEntity);
        this.productStockService.checkAttributesStock(productEntity);

        try {
            if (this.productsRepository.findNameById(productDTO.id()).equals(productDTO.name())) {

                this.productsRepository.updateProduct(productEntity);
                ProductEntity updatedProduct = productsRepository.findById(productEntity.getId()).orElseThrow();
                return new ResponseDTO<>(
                        HttpStatus.OK,
                        List.of(this.productMapper.toDTO(updatedProduct)),
                        "Product updated successfully");
            }
            ProductDTO updatedProduct = this.bulkProductService.updateProduct(productEntity);
            return new ResponseDTO<>(
                    HttpStatus.OK,
                    List.of(updatedProduct),
                    "Product updated successfully");
        } catch (Exception e) {
            log.error("Error updating product", e);
            throw new SaveDocumentFailed(DocumentsName.PRODUCT);
        }
    }

    public ResponseDTO<ProductDTO> deleteProduct(String id) {
        try {
            List<String> images = this.productsRepository.findById(id)
                    .orElseThrow(() -> new DocumentNotFound(DocumentsName.PRODUCT, id))
                    .getImages()
                    .stream()
                    .map(Images::getImage)
                    .toList();

            this.productsRepository.deleteById(id);
            this.imageStorageService.deleteImagesFromStorage(images);
            return new ResponseDTO<>(HttpStatus.OK, "Product deleted successfully");
        } catch (RuntimeException e) {
            log.error("Error deleting product", e);
            throw new DeleteDocumentFailed(DocumentsName.PRODUCT, id);
        }
    }
}
