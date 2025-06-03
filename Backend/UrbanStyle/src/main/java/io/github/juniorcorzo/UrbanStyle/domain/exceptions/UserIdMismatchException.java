package io.github.juniorcorzo.UrbanStyle.domain.exceptions;

public class UserIdMismatchException extends RuntimeException {
    public UserIdMismatchException(){
        super("User ID not assigned to token");
    }

    public UserIdMismatchException(String message) {
        super(message);
    }
}
