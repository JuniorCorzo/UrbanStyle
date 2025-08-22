package io.github.juniorcorzo.UrbanStyle.product.infrastructure.controller;

import io.github.juniorcorzo.UrbanStyle.product.application.service.ImageProcessingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/images")
@RequiredArgsConstructor
@SuppressWarnings("unused")
public class ImageProcessingController {
    private final ImageProcessingService imageProcessingService;

    @GetMapping("/{options}/{source}")
    public ResponseEntity<byte[]> imageProcessing(@PathVariable String options, @PathVariable String source) {
        this.imageProcessingService.setBufferImage(source);
        this.imageProcessingService.applyOptions(options);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("image/webp"))
                .body(this.imageProcessingService.getBufferImage().toByteArray());
    }
}
