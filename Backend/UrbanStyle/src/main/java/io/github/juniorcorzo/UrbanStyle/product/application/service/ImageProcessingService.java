package io.github.juniorcorzo.UrbanStyle.product.application.service;

import com.luciad.imageio.webp.CompressionType;
import com.luciad.imageio.webp.WebPWriteParam;
import io.github.juniorcorzo.UrbanStyle.product.domain.ImageProcessing;
import org.imgscalr.Scalr;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriter;
import javax.imageio.stream.ImageOutputStream;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.URI;
import java.nio.ByteBuffer;
import java.util.Arrays;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.locks.ReentrantReadWriteLock;

@Service
public class ImageProcessingService implements ImageProcessing {
    private static final String FORMAT_IMAGE = "webp";
    private final ReentrantReadWriteLock lock;
    private final String urlPublic;
    private BufferedImage bufferedImage;

    public ImageProcessingService(@Value("${cloudflare.url-public}") String urlPublic) {
        this.urlPublic = urlPublic;
        lock = new ReentrantReadWriteLock();
    }

    @Override
    public synchronized ByteBuffer convertToWebp(final String imageBase64) {
        this.lock.writeLock().lock();
        try {
            BufferedImage bufferedImage = ImageIO.read(new ByteArrayInputStream(this.decodeImage(imageBase64)));
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            ImageIO.write(bufferedImage, FORMAT_IMAGE, outputStream);

            return ByteBuffer.wrap(outputStream.toByteArray());
        } catch (IOException e) {
            throw new RuntimeException(e);
        } finally {
            this.lock.writeLock().unlock();
        }
    }

    @Override
    public synchronized BufferedImage resizeImage(int width, int height) {
        this.validBufferedImage();

        this.lock.writeLock().lock();
        try {
            this.bufferedImage = Scalr.resize(this.bufferedImage, Scalr.Method.BALANCED, width, height);
            return this.bufferedImage;
        } finally {
            this.lock.writeLock().unlock();
        }

    }

    @Override
    public synchronized BufferedImage resizeImage(int width) {
        this.validBufferedImage();

        this.lock.writeLock().lock();
        try {
            this.bufferedImage = Scalr.resize(this.bufferedImage, Scalr.Method.BALANCED, width);
            return this.bufferedImage;
        } finally {
            this.lock.writeLock().unlock();
        }
    }

    @Override
    public synchronized BufferedImage changeQuality(float quality) {
        this.validBufferedImage();

        this.lock.writeLock().lock();
        try {
            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            ImageOutputStream outputStream = ImageIO.createImageOutputStream(byteArrayOutputStream);
            ImageWriter imageWriter = ImageIO.getImageWritersByFormatName(FORMAT_IMAGE)
                    .next();

            WebPWriteParam imageWriteParam = ((WebPWriteParam) imageWriter.getDefaultWriteParam());
            imageWriteParam.setCompressionType(CompressionType.Lossy);
            imageWriteParam.setAlphaCompressionAlgorithm(3);
            imageWriteParam.setUseSharpYUV(true);
            imageWriteParam.setCompressionQuality(quality);
            imageWriter.setOutput(outputStream);
            imageWriter.write(null, new IIOImage(this.bufferedImage, null, null), imageWriteParam);
            outputStream.close();
            imageWriter.dispose();

            this.bufferedImage = ImageIO.read(new ByteArrayInputStream(byteArrayOutputStream.toByteArray()));

            return this.bufferedImage;
        } catch (IOException e) {
            throw new RuntimeException(e);
        } finally {
            this.lock.writeLock().unlock();
        }

    }

    //TODO:: Refactor for use design patterns
    public void applyOptions(String options) {
        if (options.isBlank()) {
            return;
        }

        Map<String, Float> optionsMap = new HashMap<>();
        Arrays.stream(options.split(",")).forEach(option -> {
            String[] separateKeyValue = option.split("=");
            optionsMap.put(separateKeyValue[0], Float.parseFloat(separateKeyValue[1]));
        });

        if (optionsMap.size() == 3) {
            this.resizeImage(
                    optionsMap.get("width").intValue(),
                    optionsMap.get("height").intValue()
            );
            this.changeQuality(optionsMap.get("quality"));
            return;
        }

        if (optionsMap.containsKey("width")) {
            this.resizeImage(optionsMap.get("width").intValue());
            return;
        }

        if (optionsMap.containsKey("quality")) this.changeQuality(optionsMap.get("quality"));
    }

    @Override
    public ByteArrayOutputStream getBufferImage() {
        this.lock.readLock().lock();
        try {
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            ImageIO.write(this.bufferedImage, FORMAT_IMAGE, outputStream);
            return outputStream;
        } catch (IOException e) {
            throw new RuntimeException(e);
        } finally {
            this.lock.readLock().unlock();
        }
    }

    @Override
    public synchronized void setBufferImage(String source) {
        this.lock.writeLock().lock();
        try {
            this.bufferedImage = ImageIO.read(
                    URI.create(String.format("%s%s", this.urlPublic, source)).toURL()
            );
        } catch (IOException e) {
            throw new RuntimeException(e);
        } finally {
            this.lock.writeLock().unlock();
        }
    }


    private byte[] decodeImage(String file) throws IOException {
        return Base64.getDecoder().decode(file.split(",")[1]);
    }

    private void validBufferedImage() {
        if (bufferedImage == null) {
            throw new RuntimeException("I don't config buffered images");
        }
    }
}
