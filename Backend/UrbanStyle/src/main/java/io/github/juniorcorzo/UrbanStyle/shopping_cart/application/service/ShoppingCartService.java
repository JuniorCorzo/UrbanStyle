package io.github.juniorcorzo.UrbanStyle.shopping_cart.application.service;

import io.github.juniorcorzo.UrbanStyle.order.domain.dto.ProductSummary;
import io.github.juniorcorzo.UrbanStyle.common.domain.enums.DocumentsName;
import io.github.juniorcorzo.UrbanStyle.common.domain.exceptions.DeleteDocumentFailed;
import io.github.juniorcorzo.UrbanStyle.common.domain.exceptions.DocumentNotFound;
import io.github.juniorcorzo.UrbanStyle.common.domain.exceptions.SaveDocumentFailed;
import io.github.juniorcorzo.UrbanStyle.shopping_cart.infrastructure.adapter.dto.ShoppingCartDTO;
import io.github.juniorcorzo.UrbanStyle.common.infrastructure.adapter.dtos.response.ResponseDTO;
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
        final String cartId = this.getCartId(userId);
        if (this.hashOperations.size(cartId) == 0) throw new DocumentNotFound(DocumentsName.SHOPPING_CART, userId);
        Map<String, ProductSummary> hash = this.hashOperations.entries(cartId);
        return new ResponseDTO<>(
                HttpStatus.OK,
                List.of(new ShoppingCartDTO(
                        userId,
                        hash.values().stream().toList()
                )),
                "Card retrieved successfully");
    }

    public ResponseDTO<ShoppingCartDTO> addProductsToCart(ShoppingCartDTO card) {
        try {
            final String cartId = this.getCartId(card.userId());
            card.items().forEach(item ->
                    this.hashOperations.put(cartId, this.getProductId(item.productId(), item.color(), item.size()), item)
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
        } catch (Exception e) {
            log.error("Error creating cart", e);
            throw new SaveDocumentFailed(DocumentsName.SHOPPING_CART);
        }
    }

    public ResponseDTO<ShoppingCartDTO> changeQuantityProduct(String userId, String productId, String color, String size, int quantity) {
        final String cartId = this.getCartId(userId);
        final String productCartId = this.getProductId(productId, color, size);

        final ProductSummary product = this.hashOperations.get(cartId, productCartId);

        assert product != null;
        ProductSummary updateProduct = ProductSummary.builder()
                .productId(product.productId())
                .name(product.name())
                .color(color)
                .size(size)
                .quantity(quantity)
                .price(product.price())
                .discount(product.discount())
                .build();

        return this.updateProductCart(new ShoppingCartDTO(userId, List.of(updateProduct)));
    }

    public ResponseDTO<ShoppingCartDTO> updateProductCart(ShoppingCartDTO card) {
        final ProductSummary product = card.items().getFirst();
        final String cartId = this.getCartId(card.userId());
        final String productId = this.getProductId(product.productId(), product.color(), product.size());
        // This checks if a cart exists using the cart ID and verifies if the product ID is the same
        if (card.items().size() != 1 || !this.hashOperations.hasKey(cartId, productId)) {
            throw new DocumentNotFound(DocumentsName.SHOPPING_CART, cartId);
        }

        try {
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
        } catch (RuntimeException e) {
            log.error("Error updating product in cart", e);
            throw new SaveDocumentFailed(DocumentsName.SHOPPING_CART);
        }
    }

    public ResponseDTO<ShoppingCartDTO> removeProductCar(String userId, String productId, String color, String size) {
        final String cartId = this.getCartId(userId);
        final String productCartId = this.getProductId(productId, color, size);

        try {
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
        } catch (RuntimeException e) {
            log.error("Error deleting product in cart", e);
            throw new DeleteDocumentFailed(DocumentsName.SHOPPING_CART, cartId);
        }
    }

    public ResponseDTO<ShoppingCartDTO> removeShoppingCart(String userId) {
        final String cardId = this.getCartId(userId);
        try {

            Set<String> keys = this.hashOperations.keys(cardId);
            this.hashOperations.delete(cardId, keys.toArray());

            return new ResponseDTO<>(
                    HttpStatus.OK,
                    "Cart deleted successfully"
            );
        } catch (RuntimeException e) {
            log.error("Error deleting cart", e);
            throw new DeleteDocumentFailed(DocumentsName.SHOPPING_CART, cardId);
        }
    }

    private String getCartId(String userId) {
        return String.format("shoppingCart:%s", userId);
    }

    private String getProductId(String productId, String color, String size) {
        return String.format("productId|%s|%s|%s", productId, color, size);
    }
}
