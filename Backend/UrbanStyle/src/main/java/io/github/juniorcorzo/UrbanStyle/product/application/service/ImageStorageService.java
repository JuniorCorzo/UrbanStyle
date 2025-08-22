package io.github.juniorcorzo.UrbanStyle.product.application.service;

import io.github.juniorcorzo.UrbanStyle.product.application.exceptions.FailedDeletingImagesToR2;
import io.github.juniorcorzo.UrbanStyle.product.application.exceptions.FailedSendImagesToR2;
import io.github.juniorcorzo.UrbanStyle.product.domain.clients.StorageFileClient;
import io.github.juniorcorzo.UrbanStyle.product.domain.adapter.dtos.Images;
import io.github.juniorcorzo.UrbanStyle.product.infrastructure.adapters.dto.common.ImagesDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.nio.ByteBuffer;
import java.time.Instant;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Service
@Slf4j
public class ImageStorageService {
    private final ExecutorService executorService;
    private final StorageFileClient storageFileClient;
    private final ImageProcessingService imageProcessingService;

    public ImageStorageService(StorageFileClient storageFileClient, ImageProcessingService imageProcessingService) {
        this.storageFileClient = storageFileClient;
        this.imageProcessingService = imageProcessingService;

        this.executorService = Executors.newFixedThreadPool(Runtime.getRuntime().availableProcessors());
    }

    public String sendImageToStorage(String image) {
        long startTime = Instant.now().toEpochMilli();
        log.info("Sending image to Cloudflare R2");
        try {
            ByteBuffer imageWebp = this.imageProcessingService.convertToWebp(image);
            return this.storageFileClient.uploadImage(imageWebp);
        } catch (Exception e) {
            log.error("Error sending image to Cloudflare R2: {}", e.getMessage(), e);
            throw new FailedSendImagesToR2();
        } finally {
            log.info("Sending image to Cloudflare R2 completed in {} ms", Instant.now().toEpochMilli() - startTime);
        }
    }

    public List<Images> sendImagesToStorage(List<ImagesDTO> images) {
        final long startTime = Instant.now().toEpochMilli();
        log.info("Sending {} images to Cloudflare R2", images.size());

        try {
            List<CompletableFuture<Images>> prevSendImage = images.stream()
                    .map(image -> CompletableFuture.supplyAsync(() -> {
                                ByteBuffer imageWebp = this.imageProcessingService.convertToWebp(image.image());
                                String imagenUpload = this.storageFileClient.uploadImage(imageWebp);
                                return Images.builder()
                                        .color(image.color())
                                        .image(imagenUpload)
                                        .build();
                            }, executorService)
                    ).toList();

            List<Images> sendImage = CompletableFuture.allOf(prevSendImage.toArray(new CompletableFuture[0]))
                    .thenApply(i -> prevSendImage.stream()
                            .map(CompletableFuture::join)
                            .toList()).get();

            log.info("Sending {} images to Cloudflare R2 completed in {} ms", images.size(), Instant.now().toEpochMilli() - startTime);
            return sendImage;
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error sending images to Cloudflare R2: {}", e.getMessage(), e);
            throw new FailedSendImagesToR2();
        }
    }

    public void deleteImagesFromStorage(List<String> images) {
        log.info("Delete {} images to Cloudflare R2", images.size());
        try {
            images.forEach(image -> this.executorService
                    .submit(() -> this.storageFileClient.deleteImage(image))
            );
        } catch (Exception e) {
            log.error("Error deleting images to Cloudflare R2: {}", e.getMessage(), e);
            throw new FailedDeletingImagesToR2();
        }
    }
}
