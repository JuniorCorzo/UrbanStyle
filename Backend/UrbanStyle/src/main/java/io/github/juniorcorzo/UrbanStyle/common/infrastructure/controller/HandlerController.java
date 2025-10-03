package io.github.juniorcorzo.UrbanStyle.common.infrastructure.controller;

import io.github.juniorcorzo.UrbanStyle.common.domain.dtos.ResponseError;
import io.github.juniorcorzo.UrbanStyle.common.domain.exceptions.*;
import io.github.juniorcorzo.UrbanStyle.order.application.service.exceptions.FailedChangeStatusInOrder;
import io.github.juniorcorzo.UrbanStyle.product.application.exceptions.FailedDeletingImagesToR2;
import io.github.juniorcorzo.UrbanStyle.product.application.exceptions.FailedSendImagesToR2;
import io.github.juniorcorzo.UrbanStyle.terms.application.exceptions.NotFoundTermsValid;
import io.github.juniorcorzo.UrbanStyle.terms.application.exceptions.TermsInsertionException;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
@Order(Ordered.HIGHEST_PRECEDENCE)
@SuppressWarnings("unused")
public class HandlerController {

    @ExceptionHandler(DocumentNotFound.class)
    public ResponseEntity<ResponseError> handleDocumentNotFound(DocumentNotFound e) {
        return new ResponseEntity<>(new ResponseError(
                HttpStatus.NOT_FOUND,
                e.getMessage()
        ), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(IdFormatNotValid.class)
    public ResponseEntity<ResponseError> handleIdFormatNotValid(IdFormatNotValid e) {
        return new ResponseEntity<>(new ResponseError(
                HttpStatus.BAD_REQUEST,
                e.getMessage()
        ), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(SaveDocumentFailed.class)
    public ResponseEntity<ResponseError> handleSaveDocumentFailed(SaveDocumentFailed e) {
        return new ResponseEntity<>(new ResponseError(
                HttpStatus.CONFLICT,
                e.getMessage()
        ), HttpStatus.CONFLICT);
    }

    @ExceptionHandler(DeleteDocumentFailed.class)
    public ResponseEntity<ResponseError> handleDeleteDocumentFailed(DeleteDocumentFailed e) {
        return new ResponseEntity<>(new ResponseError(
                HttpStatus.INTERNAL_SERVER_ERROR,
                e.getMessage()
        ), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(FieldExists.class)
    public ResponseEntity<ResponseError> handleFieldExist(FieldExists e) {
        return new ResponseEntity<>(new ResponseError(
                HttpStatus.CONFLICT,
                e.getMessage()
        ), HttpStatus.CONFLICT);
    }

    @ExceptionHandler(CredentialsNotValid.class)
    public ResponseEntity<ResponseError> handleCredentialsNotValid(CredentialsNotValid e) {
        return new ResponseEntity<>(new ResponseError(
                HttpStatus.UNAUTHORIZED,
                e.getMessage()
        ), HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(FailedChangeStatusInOrder.class)
    public ResponseEntity<ResponseError> handleFailedChangeStatusInOrder(FailedChangeStatusInOrder e) {
        return new ResponseEntity<>(new ResponseError(
                HttpStatus.INTERNAL_SERVER_ERROR,
                e.getMessage()
        ), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(FailedSendImagesToR2.class)
    public ResponseEntity<ResponseError> handleFailedSendImagesToR2(FailedSendImagesToR2 e) {
        return new ResponseEntity<>(new ResponseError(
                HttpStatus.INTERNAL_SERVER_ERROR,
                e.getMessage()
        ), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(FailedDeletingImagesToR2.class)
    public ResponseEntity<ResponseError> handleFailedDeletingImagesToR2(FailedDeletingImagesToR2 e) {
        return new ResponseEntity<>(new ResponseError(
                HttpStatus.INTERNAL_SERVER_ERROR,
                e.getMessage()
        ), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(TokenGenerationException.class)
    public ResponseEntity<ResponseError> handleTokenGenerationException(TokenGenerationException e) {
        return new ResponseEntity<>(new ResponseError(
                HttpStatus.INTERNAL_SERVER_ERROR,
                e.getMessage()
        ), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(TokenValidationException.class)
    public ResponseEntity<ResponseError> handleTokenValidationException(TokenValidationException e) {
        return new ResponseEntity<>(new ResponseError(
                HttpStatus.UNAUTHORIZED,
                e.getMessage()
        ), HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(TokenExpiredException.class)
    public ResponseEntity<ResponseError> handleTokenExpiredException(TokenExpiredException e) {
        return new ResponseEntity<>(new ResponseError(
                HttpStatus.UNAUTHORIZED,
                e.getMessage()
        ), HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ResponseError> handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {
        Map<String, String> errors = new HashMap<>();
        e.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        return new ResponseEntity<>(new ResponseError(
                HttpStatus.BAD_REQUEST,
                errors
        ), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(UserIdMismatchException.class)
    public ResponseEntity<ResponseError> handleUserIdMismatchException(UserIdMismatchException e) {
        return new ResponseEntity<>(new ResponseError(
                HttpStatus.UNAUTHORIZED,
                e.getMessage()
        ), HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(TermsInsertionException.class)
    public ResponseEntity<ResponseError> handleTermsInsertionException(TermsInsertionException e) {
        return new ResponseEntity<>(new ResponseError(
                HttpStatus.BAD_REQUEST,
                e.getMessage()
        ), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(NotFoundTermsValid.class)
    public ResponseEntity<ResponseError> handleNotFoundTermsValid(NotFoundTermsValid e) {
        return new ResponseEntity<>(new ResponseError(
                HttpStatus.NOT_FOUND,
                e.getMessage()
        ), HttpStatus.NOT_FOUND);
    }

}