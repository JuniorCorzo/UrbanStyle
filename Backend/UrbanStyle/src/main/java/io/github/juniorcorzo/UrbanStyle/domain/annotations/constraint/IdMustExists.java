package io.github.juniorcorzo.UrbanStyle.domain.annotations.constraint;

import io.github.juniorcorzo.UrbanStyle.domain.annotations.validator.ValidExistById;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Constraint(validatedBy = ValidExistById.class)
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
public @interface IdMustExists {
    Class<?> entity();

    String message() default "No record found for given ID";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
