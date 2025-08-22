package io.github.juniorcorzo.UrbanStyle.product.domain.clients;

import java.nio.ByteBuffer;

public interface StorageFileClient {
    String uploadImage(ByteBuffer imageBuffer);

    void deleteImage(String key);
}
