package io.github.juniorcorzo.UrbanStyle.terms.infrastructure.adapter.mapper;

import io.github.juniorcorzo.UrbanStyle.terms.domain.entities.TermsEntity;
import io.github.juniorcorzo.UrbanStyle.terms.infrastructure.adapter.dto.TermsDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TermMapper {

    TermsDTO toDto(TermsEntity entity);
}
