package io.github.juniorcorzo.UrbanStyle.infrastructure.client;

import io.github.juniorcorzo.UrbanStyle.domain.clients.StorageFileClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3Configuration;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectResponse;

import java.io.IOException;
import java.net.URI;
import java.nio.ByteBuffer;
import java.util.Base64;
import java.util.UUID;

@Configuration
public class CloudflareR2Client implements StorageFileClient {
    private final S3Client s3Client;
    //    private String accountId;
    private final String accessKeyId;
    private final String secretAccessKey;
    private final String endpoint;
    private final String bucketName;
    private final String publicUrl;

    public CloudflareR2Client(
            @Value("${cloudflare.key.access}") String accessKeyId,
            @Value("${cloudflare.key.secret}") String secretAccessKey,
            @Value("${cloudflare.endpoint}") String endpoint,
            @Value("${cloudflare.bucket.name}") String bucketName,
            @Value("${cloudflare.url-public}") String publicUrl) {
        this.accessKeyId = accessKeyId;
        this.secretAccessKey = secretAccessKey;
        this.endpoint = endpoint;
        this.bucketName = bucketName;
        this.publicUrl = publicUrl;

        this.s3Client = this.buildS3Client();
    }


    @Override
    public String uploadImage(ByteBuffer imageBuffer) {
        String key = UUID.randomUUID().toString();

        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .contentType("image/webp")
                .build();

        PutObjectResponse response = this.s3Client.putObject(putObjectRequest, RequestBody.fromByteBuffer(imageBuffer));
        return String.format("%s%s", publicUrl, key);
    }

    private S3Client buildS3Client() {
        S3Configuration serviceConfiguration = S3Configuration.builder()
                .pathStyleAccessEnabled(true)
                .build();

        assert endpoint != null;
        return S3Client.builder()
                .credentialsProvider(() -> AwsBasicCredentials.create(this.accessKeyId, this.secretAccessKey))
                .region(Region.of("auto"))
                .serviceConfiguration(serviceConfiguration)
                .endpointOverride(URI.create(endpoint))
                .build();
    }
}
