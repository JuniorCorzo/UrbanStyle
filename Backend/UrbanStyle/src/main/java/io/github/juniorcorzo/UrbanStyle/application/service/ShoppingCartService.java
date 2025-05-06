package io.github.juniorcorzo.UrbanStyle.application.service;

import io.github.juniorcorzo.UrbanStyle.domain.dtos.ProductSummary;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.common.ShoppingCartDTO;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.response.ResponseDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class ShoppingCartService {
    private final HashOperations<String, String, ProductSummary> hashOperations;

    public ResponseDTO<ShoppingCartDTO> getShoppingCartByUserId(String userId) {
        final String cardId = String.format("shoppingCart:%s", userId);
        Map<String, ProductSummary> hash = this.hashOperations.entries(cardId);
        System.out.println(hash);
        return new ResponseDTO<>(
                HttpStatus.OK,
                List.of(new ShoppingCartDTO(
                        userId,
                        hash.values().stream().toList()
                )),
                "Card retrieved successfully");
    }

    public ResponseDTO<ShoppingCartDTO> addProductsToCart(ShoppingCartDTO card) {
        final String cartId = String.format("shoppingCart:%s", card.userId());

        card.items().forEach(item ->
                this.hashOperations.put(cartId, String.format("productId:%s", item.productId()), item)
        );
        Map<String, ProductSummary> currentProducts = this.hashOperations.entries(cartId);

        return new ResponseDTO<>(
                HttpStatus.CREATED,
                List.of(new ShoppingCartDTO(
                        card.userId(),
                        currentProducts.values().stream().toList()
                )),
                "Cart created successfully"
        );
    }

    public ResponseDTO<ShoppingCartDTO> updateProductCart(ShoppingCartDTO card) {
        final ProductSummary product = card.items().getFirst();
        final String cartId = String.format("shoppingCart:%s", card.userId());
        if (card.items().size() != 1 || !this.hashOperations.hasKey(cartId, String.format("productId:%s", product.productId()))) {
            throw new RuntimeException("Cart not found");
        }

        this.hashOperations.put(
                cartId,
                String.format(
                        "productId:%s",
                        product.productId()
                ),
                product
        );

        Map<String, ProductSummary> currentProducts = this.hashOperations.entries(cartId);
        return new ResponseDTO<>(
                HttpStatus.OK,
                List.of(new ShoppingCartDTO(
                        card.userId(),
                        currentProducts.values().stream().toList()
                )),
                "Product update in cart updated successfully"
        );
    }

    public ResponseDTO<ShoppingCartDTO> removeProductCar(String userId, String productId) {
        String cartId = String.format("shoppingCart:%s", userId);
        String productCartId = String.format("productId:%s", productId);

        this.hashOperations.delete(
                cartId,
                productCartId
        );

        Map<String, ProductSummary> currentProducts = this.hashOperations.entries(cartId);
        return new ResponseDTO<>(
                HttpStatus.OK,
                List.of(new ShoppingCartDTO(
                        userId,
                        currentProducts.values().stream().toList()
                )),
                "Product delete of cart deleted successfully"
        );
    }

    public ResponseDTO<ShoppingCartDTO> removeShoppingCart(String userId) {
        String cardId = String.format("shoppingCart:%s", userId);
        Set<String> keys = this.hashOperations.keys(cardId);
        this.hashOperations.delete(cardId, keys.toArray());

        return new ResponseDTO<>(
                HttpStatus.OK,
                "Cart deleted successfully"
        );
    }
}
