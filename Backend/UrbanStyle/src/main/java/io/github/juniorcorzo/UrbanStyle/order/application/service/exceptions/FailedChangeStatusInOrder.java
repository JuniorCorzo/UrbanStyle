package io.github.juniorcorzo.UrbanStyle.order.application.service.exceptions;

public class FailedChangeStatusInOrder extends RuntimeException {
    public FailedChangeStatusInOrder() {
        super("Failed to change status in order");
    }
}
