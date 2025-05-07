package io.github.juniorcorzo.UrbanStyle.application.service;

import io.github.juniorcorzo.UrbanStyle.domain.clients.StorageFileClient;
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

    public List<String> sendImagesToStorage(List<String> images) {
        final long startTime = Instant.now().toEpochMilli();
        log.info("Sending {} images to Cloudflare R2", images.size());
        List<CompletableFuture<String>> prevSendImage = images.stream()
                .map(image -> CompletableFuture.supplyAsync(() -> {
                            ByteBuffer imageWebp = this.imageProcessingService.convertToWebp(image);
                            return this.storageFileClient.uploadImage(imageWebp);
                        }, executorService)
                ).toList();
        List<String> sendImage;
        try {
            sendImage = CompletableFuture.allOf(prevSendImage.toArray(new CompletableFuture[0]))
                    .thenApply(i -> prevSendImage.stream()
                            .map(CompletableFuture::join)
                            .toList()).get();
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error sending images to Cloudflare R2", e);
            throw new RuntimeException(e);
        }
        log.info("Sending {} images to Cloudflare R2 completed in {} ms", images.size(), Instant.now().toEpochMilli() - startTime);

        return sendImage;
    }

    public void deleteImagesFromStorage(List<String> images) {
        log.info("Delete {} images to Cloudflare R2", images.size());
        images.forEach(image -> this.executorService
                .submit(() -> this.storageFileClient.deleteImage(image))
        );
    }
}
