package io.github.juniorcorzo.UrbanStyle.order.infrastructure.adapter.dto.request;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.github.juniorcorzo.UrbanStyle.common.domain.annotations.constraint.IdFormatConstraint;
import io.github.juniorcorzo.UrbanStyle.common.domain.annotations.constraint.IdMustExists;
import io.github.juniorcorzo.UrbanStyle.common.domain.annotations.groups.OnCreate;
import io.github.juniorcorzo.UrbanStyle.common.domain.annotations.groups.OnUpdate;
import io.github.juniorcorzo.UrbanStyle.order.domain.dto.OrderHistory;
import io.github.juniorcorzo.UrbanStyle.user.domain.entities.UserEntity;
import io.github.juniorcorzo.UrbanStyle.order.domain.enums.OrderStatus;
import io.github.juniorcorzo.UrbanStyle.order.domain.enums.PaymentMethod;
import io.github.juniorcorzo.UrbanStyle.address.infrastructure.adapter.dto.AddressDTO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record OrdersSaveDTO(
        @IdFormatConstraint(groups = {OnUpdate.class})
        @IdMustExists(entity = OrderHistory.class, groups = {OnUpdate.class})
        String id,
        @IdFormatConstraint(groups = {OnCreate.class, OnUpdate.class})
        @IdMustExists(entity = UserEntity.class, groups = {OnCreate.class, OnUpdate.class})
        String userId,
        @NotNull(groups = {OnCreate.class, OnUpdate.class})
        @Valid
        AddressDTO address,
        @JsonProperty(access = JsonProperty.Access.READ_ONLY)
        OrderStatus status,
        @NotNull(message = "Payment method must be provided", groups = {OnCreate.class, OnUpdate.class})
        PaymentMethod paymentMethod

) {
}
