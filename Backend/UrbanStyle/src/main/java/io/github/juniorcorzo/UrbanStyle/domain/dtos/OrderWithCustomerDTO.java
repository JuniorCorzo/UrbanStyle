package io.github.juniorcorzo.UrbanStyle.domain.dtos;

import io.github.juniorcorzo.UrbanStyle.domain.abstracts.Order;
import lombok.*;


@AllArgsConstructor
@NoArgsConstructor
@Getter
@EqualsAndHashCode(callSuper = true)
@ToString
public class OrderWithCustomerDTO extends Order {
        private CustomerDTO customer;
}

