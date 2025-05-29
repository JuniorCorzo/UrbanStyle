package io.github.juniorcorzo.UrbanStyle.application.exceptions;

public class FailedChangeStatusInOrder extends RuntimeException {
    public FailedChangeStatusInOrder() {
        super("Failed to change status in order");
    }
}
