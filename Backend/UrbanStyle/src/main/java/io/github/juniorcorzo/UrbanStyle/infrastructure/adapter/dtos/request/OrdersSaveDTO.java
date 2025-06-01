package io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.request;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.github.juniorcorzo.UrbanStyle.domain.annotations.constraint.IdFormatConstraint;
import io.github.juniorcorzo.UrbanStyle.domain.annotations.constraint.IdMustExists;
import io.github.juniorcorzo.UrbanStyle.domain.annotations.groups.OnUpdate;
import io.github.juniorcorzo.UrbanStyle.domain.dtos.OrderHistory;
import io.github.juniorcorzo.UrbanStyle.domain.dtos.ProductSummary;
import io.github.juniorcorzo.UrbanStyle.domain.enums.PaymentMethod;
import io.github.juniorcorzo.UrbanStyle.domain.enums.OrderStatus;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.common.AddressDTO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import java.time.LocalDateTime;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record OrdersSaveDTO(
        @IdFormatConstraint(groups = {OnUpdate.class})
        @IdMustExists(entity = OrderHistory.class, groups = {OnUpdate.class})
        String id,
        @NotBlank
        String userId,
        @NotEmpty(message = "Products must be provided")
        List<ProductSummary> products,
        @DecimalMin(value = "0.0", message = "Total must be greater than or equal to 0")
        double total,
        @NotNull
        OrderStatus status,
        @NotNull
        @Valid
        AddressDTO address,
        @NotNull(message = "Payment method must be provided")
        PaymentMethod paymentMethod,
        @NotNull(message = "Order date must be provided")
        LocalDateTime orderDate
) {
}
