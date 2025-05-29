package io.github.juniorcorzo.UrbanStyle.application.exceptions;

public class FailedSendImagesToR2 extends RuntimeException {
    public FailedSendImagesToR2() {
        super("Failed to send images to R2");
    }
}
