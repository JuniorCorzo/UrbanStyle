package io.github.juniorcorzo.UrbanStyle.product.application.service;

import io.github.juniorcorzo.UrbanStyle.common.domain.enums.DocumentsName;
import io.github.juniorcorzo.UrbanStyle.common.domain.exceptions.DeleteDocumentFailed;
import io.github.juniorcorzo.UrbanStyle.common.domain.exceptions.SaveDocumentFailed;
import io.github.juniorcorzo.UrbanStyle.common.infrastructure.adapter.dtos.response.ResponseDTO;
import io.github.juniorcorzo.UrbanStyle.product.domain.adapter.dtos.Images;
import io.github.juniorcorzo.UrbanStyle.product.domain.repository.ProductsRepository;
import io.github.juniorcorzo.UrbanStyle.product.infrastructure.adapters.dto.common.ImagesDTO;
import io.github.juniorcorzo.UrbanStyle.product.infrastructure.adapters.dto.common.ProductDTO;
import io.github.juniorcorzo.UrbanStyle.product.infrastructure.adapters.dto.request.ProductImagesDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductImageService {
    private final ProductsRepository productsRepository;
    private final ImageStorageService imageStorageService;

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

}
