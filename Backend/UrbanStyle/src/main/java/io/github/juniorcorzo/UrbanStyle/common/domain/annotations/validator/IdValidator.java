package io.github.juniorcorzo.UrbanStyle.common.domain.annotations.validator;


import io.github.juniorcorzo.UrbanStyle.common.domain.annotations.constraint.IdFormatConstraint;
import io.github.juniorcorzo.UrbanStyle.common.domain.exceptions.IdFormatNotValid;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.bson.types.ObjectId;

public class IdValidator implements ConstraintValidator<IdFormatConstraint, String> {

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (!ObjectId.isValid(value)) throw new IdFormatNotValid();

        return true;
    }
}
