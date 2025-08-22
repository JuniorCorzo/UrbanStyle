package io.github.juniorcorzo.UrbanStyle.product.infrastructure.client;

import io.github.juniorcorzo.UrbanStyle.product.domain.clients.StorageFileClient;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3Configuration;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.DeleteObjectResponse;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectResponse;

import java.net.URI;
import java.nio.ByteBuffer;
import java.util.UUID;

public class CloudflareR2Client implements StorageFileClient {
    private final S3Client s3Client;
    private final String accessKeyId;
    private final String secretAccessKey;
    private final String endpoint;
    private final String bucketName;

    public CloudflareR2Client(
            String accessKeyId,
            String secretAccessKey,
            String endpoint,
            String bucketName
    ) {
        this.accessKeyId = accessKeyId;
        this.secretAccessKey = secretAccessKey;
        this.endpoint = endpoint;
        this.bucketName = bucketName;

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
        return key;
    }

    @Override
    public void deleteImage(String key) {
        DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();

        DeleteObjectResponse response = this.s3Client.deleteObject(deleteObjectRequest);
    }

    private S3Client buildS3Client() {
        S3Configuration serviceConfiguration = S3Configuration.builder()
                .pathStyleAccessEnabled(true)
                .chunkedEncodingEnabled(false)
                .build();

        return S3Client.builder()
                .credentialsProvider(() -> AwsBasicCredentials.create(this.accessKeyId, this.secretAccessKey))
                .region(Region.US_EAST_1)
                .serviceConfiguration(serviceConfiguration)
                .endpointOverride(URI.create(endpoint))
                .build();
    }
}
