package io.github.juniorcorzo.UrbanStyle.application.service;

import io.github.juniorcorzo.UrbanStyle.domain.clients.StorageFileClient;
import org.springframework.stereotype.Service;

import java.nio.ByteBuffer;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.stream.Collectors;

@Service
public class ImageStorageService {
    private final ExecutorService executorService;
    private final StorageFileClient storageFileClient;
    private final ImageProcessingService imageProcessingService;

    public ImageStorageService(StorageFileClient storageFileClient, ImageProcessingService imageProcessingService) {
        this.storageFileClient = storageFileClient;
        this.imageProcessingService = imageProcessingService;

        this.executorService = Executors.newFixedThreadPool(Runtime.getRuntime().availableProcessors());
    }

    public CompletableFuture<List<String>> sendImagesToStorage(List<String> images) {
        List<CompletableFuture<String>> sendImage = images.stream()
                .map(image -> CompletableFuture.supplyAsync(() -> {
                    ByteBuffer imageWebp = this.imageProcessingService.convertToWebp(image);
                    return this.storageFileClient.uploadImage(imageWebp);
                }, executorService)
                ).toList();

        return CompletableFuture.allOf(sendImage.toArray(new CompletableFuture[0]))
                .thenApply(i -> sendImage.stream()
                        .map(CompletableFuture::join)
                        .toList());
    }

    public void deleteImagesFromStorage(List<String> images) {
        images.forEach(image -> this.executorService
                .submit(() -> this.storageFileClient.deleteImage(image))
        );
    }
}
