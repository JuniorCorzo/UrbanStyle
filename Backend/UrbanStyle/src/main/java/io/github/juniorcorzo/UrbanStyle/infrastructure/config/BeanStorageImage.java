package io.github.juniorcorzo.UrbanStyle.infrastructure.config;

import io.github.juniorcorzo.UrbanStyle.domain.clients.StorageFileClient;
import io.github.juniorcorzo.UrbanStyle.infrastructure.client.CloudflareR2Client;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;

@Configuration
public class BeanStorageImage {
    @Bean
    @Lazy
    public StorageFileClient storageFileClient(
            @Value("${cloudflare.key.access}") String accessKeyId,
            @Value("${cloudflare.key.secret}") String secretAccessKey,
            @Value("${cloudflare.endpoint}") String endpoint,
            @Value("${cloudflare.bucket.name}") String bucketName
    ) {
        return new CloudflareR2Client(accessKeyId, secretAccessKey, endpoint, bucketName);
    }
}
