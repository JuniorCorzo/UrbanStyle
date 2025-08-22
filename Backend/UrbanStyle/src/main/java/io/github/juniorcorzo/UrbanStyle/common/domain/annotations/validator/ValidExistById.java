package io.github.juniorcorzo.UrbanStyle.common.domain.annotations.validator;

import io.github.juniorcorzo.UrbanStyle.common.domain.annotations.constraint.IdMustExists;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ValidExistById implements ConstraintValidator<IdMustExists, String> {
    private final MongoTemplate mongoTemplate;
    private Class<?> entityClass;

    @Override
    public void initialize(IdMustExists constraintAnnotation) {
        this.entityClass = constraintAnnotation.entity();
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        final Query query = Query.query(Criteria.where("_id").is(value));
        return this.mongoTemplate.exists(query, this.entityClass);
    }
}
