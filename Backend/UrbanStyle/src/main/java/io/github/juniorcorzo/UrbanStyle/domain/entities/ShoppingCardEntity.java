package io.github.juniorcorzo.UrbanStyle.domain.entities;

import io.github.juniorcorzo.UrbanStyle.domain.dtos.ProductSummary;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import java.util.List;

@Data
@RedisHash("shoppingCard")
public class ShoppingCardEntity {
    @Id
    private String userId;
    private List<ProductSummary> items;
}
