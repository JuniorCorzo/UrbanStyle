package io.github.juniorcorzo.UrbanStyle.domain.clients;

import java.nio.ByteBuffer;

public interface StorageFileClient {
    String uploadImage(ByteBuffer imageBuffer);
}
