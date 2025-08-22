package io.github.juniorcorzo.UrbanStyle.application.service;

import io.github.juniorcorzo.UrbanStyle.application.commands.attributes.AttributeCommand;
import io.github.juniorcorzo.UrbanStyle.application.commands.attributes.AttributeCommandFactory;
import io.github.juniorcorzo.UrbanStyle.application.commands.stock.StockCommandFactory;
import io.github.juniorcorzo.UrbanStyle.application.commands.stock.StockMovementCommand;
import io.github.juniorcorzo.UrbanStyle.application.service.aggregations.ProductAggregationService;
import io.github.juniorcorzo.UrbanStyle.application.service.bulks.BulkProductService;
import io.github.juniorcorzo.UrbanStyle.application.service.bulks.ProductStockCommandOrchestrator;
import io.github.juniorcorzo.UrbanStyle.domain.dtos.Images;
import io.github.juniorcorzo.UrbanStyle.domain.dtos.ProductAggregationDomain;
import io.github.juniorcorzo.UrbanStyle.domain.entities.Attribute;
import io.github.juniorcorzo.UrbanStyle.domain.entities.ProductEntity;
import io.github.juniorcorzo.UrbanStyle.domain.enums.DocumentsName;
import io.github.juniorcorzo.UrbanStyle.domain.exceptions.DeleteDocumentFailed;
import io.github.juniorcorzo.UrbanStyle.domain.exceptions.DocumentNotFound;
import io.github.juniorcorzo.UrbanStyle.domain.exceptions.SaveDocumentFailed;
import io.github.juniorcorzo.UrbanStyle.domain.repository.ProductsRepository;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.common.ImagesDTO;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.common.ProductDTO;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.request.ProductImagesDTO;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.response.ResponseDTO;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.mapper.ProductMapper;
import io.github.juniorcorzo.UrbanStyle.application.utils.AttributesManageUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class ProductService {
    private final ProductsRepository productsRepository;
    private final ProductMapper productMapper;
    private final ProductAggregationService productAggregationService;
    private final ProductStockCommandOrchestrator productStockOrchestrator;

    private final StockCommandFactory stockCommandFactory;
    private final ImageStorageService imageStorageService;
    private final BulkProductService bulkProductService;

    public static int getTotalStock(List<Attribute> attributes) {
        return attributes.stream().reduce(0, (acc, attribute) -> acc + attribute.getQuantity(), Integer::sum);
    }

    public ResponseDTO<ProductDTO> getAllProducts() {
        List<ProductDTO> products = this.productsRepository
                .findAll()
                .stream()
                .map(this.productMapper::toDTO)
                .toList();

        return new ResponseDTO<>(HttpStatus.OK, products, "Products retrieved successfully");
    }

    public ResponseDTO<ProductDTO> getProductById(String id) {
        ProductEntity productResponse = this.productsRepository
                .findById(id)
                .orElseThrow(() -> new DocumentNotFound(DocumentsName.PRODUCT, id));

        return new ResponseDTO<>(HttpStatus.OK, List.of(this.productMapper.toDTO(productResponse)),
                "Product retrieved successfully");
    }

    public ResponseDTO<ProductAggregationDomain> groupProductsByCategories() {
        List<ProductAggregationDomain> productsGroupedByCategories = this.productAggregationService
                .productsGroupedByCategory();

        return new ResponseDTO<>(HttpStatus.OK, productsGroupedByCategories, "Product retrieved successfully");
    }

    public ResponseDTO<ProductDTO> getProductsByCategory(String categoryName) {
        List<ProductDTO> products = this.productsRepository.findByCategory(categoryName)
                .orElseThrow(() -> new DocumentNotFound(DocumentsName.CATEGORY, categoryName)).stream()
                .map(this.productMapper::toDTO).toList();

        return new ResponseDTO<>(HttpStatus.OK, products, "Products retrieved successfully");
    }

    public ResponseDTO<ProductDTO> searchProducts(String search) {
        List<ProductDTO> products = this.productsRepository
                .searchProducts(search)
                .stream()
                .map(this.productMapper::toDTO)
                .toList();

        return new ResponseDTO<>(HttpStatus.OK, products, "Products retrieved successfully");
    }

    public ResponseDTO<ProductDTO> createProduct(ProductDTO productDTO) {
        final ProductEntity productEntity = this.productMapper.toEntity(productDTO);
        final List<Images> futureImages = this.imageStorageService.sendImagesToStorage(productDTO.images());
        int stock = getTotalStock(productEntity.getAttributes());
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


    public ResponseDTO<ProductDTO> addImages(ProductImagesDTO productImagesDTO) {
        try {
            List<Images> keyImages = this.imageStorageService.sendImagesToStorage(productImagesDTO.images());
            this.productsRepository.saveImagesToProduct(productImagesDTO.productId(), keyImages);

            return new ResponseDTO<>(HttpStatus.OK, "Images added successfully");
        } catch (RuntimeException e) {
            log.error("Failed adding images to product with id {}", productImagesDTO.productId(), e);
            throw new SaveDocumentFailed(DocumentsName.IMAGES);
        }
    }

    public ResponseDTO<ProductDTO> updateProduct(ProductDTO productDTO) {
        ProductEntity productEntity = this.productMapper.toEntity(productDTO);
        productEntity.setStock(getTotalStock(productEntity.getAttributes()));

        AttributesManageUtils.setAttributesSku(productEntity);
        this.checkAttributesStock(productEntity);

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

    public ResponseDTO<ProductDTO> deleteImagesFromProduct(ProductImagesDTO productImagesDTO) {
        try {

            this.imageStorageService.deleteImagesFromStorage(
                    productImagesDTO.images()
                            .stream()
                            .map(ImagesDTO::image)
                            .toList());

            this.productsRepository.deleteImagesFromProduct(
                    productImagesDTO.productId(),
                    productImagesDTO.images()
                            .stream()
                            .map(images -> Images
                                    .builder()
                                    .color(images.color())
                                    .image(images.image())
                                    .build())
                            .toList());

            return new ResponseDTO<>(HttpStatus.OK, "Images deleted successfully");
        } catch (RuntimeException e) {
            log.error("Error deleting images from product", e);
            throw new DeleteDocumentFailed(DocumentsName.IMAGES, productImagesDTO.productId());
        }
    }

    /**
     * Validates and updates the newStock movements for the attributes of a given product.
     * Depending on the current state of newStock and the new changes, appropriate newStock movement records
     * are created, including handling new attributes, quantity adjustments, and removals.
     *
     * @param product The product entity containing updated attribute details to be checked and synchronized
     *                with existing newStock data.
     */
    @Transactional
    private void checkAttributesStock(final ProductEntity product) {
        final String userId = this.getUserIdBySecurityContext();
        final List<Attribute> currentAttributes = this.productsRepository
                .findAttributesById(product.getId())
                .getAttributes();

        final List<AttributeCommand> attributesCommand = AttributeCommandFactory
                .createAttributeCommand(product.getId(), currentAttributes, product.getAttributes());
        final List<StockMovementCommand> stockCommands = stockCommandFactory.createStockMovementCommand(
                product.getId(),
                userId,
                currentAttributes,
                product.getAttributes()
        );

        this.productStockOrchestrator.addAttributesOperations(attributesCommand);
        this.productStockOrchestrator.addStockMovementsCommands(stockCommands);

        this.productStockOrchestrator.executeCommands();
    }


    private String getUserIdBySecurityContext() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }
}
