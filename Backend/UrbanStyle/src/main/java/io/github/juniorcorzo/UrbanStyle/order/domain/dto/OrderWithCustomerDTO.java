package io.github.juniorcorzo.UrbanStyle.order.domain.dto;

import io.github.juniorcorzo.UrbanStyle.order.domain.abstracts.Order;
import lombok.*;


@AllArgsConstructor
@NoArgsConstructor
@Getter
@EqualsAndHashCode(callSuper = true)
@ToString
public class OrderWithCustomerDTO extends Order {
        private CustomerDTO customer;
}

