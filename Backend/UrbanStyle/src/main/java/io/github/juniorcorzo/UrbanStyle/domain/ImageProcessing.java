package io.github.juniorcorzo.UrbanStyle.domain;


import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.nio.ByteBuffer;

public interface ImageProcessing {
    ByteBuffer convertToWebp(String imageBase64);

    BufferedImage resizeImage( int width, int height);
    BufferedImage resizeImage( int width);
    BufferedImage changeQuality( float quality);

    ByteArrayOutputStream getBufferImage();

    void setBufferImage(String source);

}
