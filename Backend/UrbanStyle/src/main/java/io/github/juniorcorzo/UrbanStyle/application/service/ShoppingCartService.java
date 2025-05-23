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
        final String cardId = this.getCartId(userId);
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
        final String cartId = this.getCartId(card.userId());

        card.items().forEach(item ->
                this.hashOperations.put(cartId, this.getProductId(item.productId()), item)
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

    public ResponseDTO<ShoppingCartDTO> changeQuantityProduct(String userId, String productId, int quantity) {
        final String cartId = this.getCartId(userId);
        final String productCartId = this.getProductId(productId);

        ProductSummary product = this.hashOperations.get(cartId, productCartId);
        assert product != null;

        ProductSummary updateProduct = ProductSummary.builder()
                .productId(product.productId())
                .name(product.name())
                .quantity(quantity)
                .price(product.price())
                .discount(product.discount())
                .build();

        return this.updateProductCart(new ShoppingCartDTO(userId, List.of(updateProduct)));
    }

    public ResponseDTO<ShoppingCartDTO> updateProductCart(ShoppingCartDTO card) {
        final ProductSummary product = card.items().getFirst();
        final String cartId = this.getCartId(card.userId());
        final String productId = this.getProductId(product.productId());
        // This checks if a cart exists using the cart ID and verifies if the product ID is the same
        if (card.items().size() != 1 || !this.hashOperations.hasKey(cartId, productId)) {
            throw new RuntimeException("Cart not found");
        }

        this.hashOperations.put(
                cartId,
                productId,
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

    private String getCartId(String userId) {
        return String.format("shoppingCart:%s", userId);
    }

    private String getProductId(String productId) {
        return String.format("productId:%s", productId);
    }
}
