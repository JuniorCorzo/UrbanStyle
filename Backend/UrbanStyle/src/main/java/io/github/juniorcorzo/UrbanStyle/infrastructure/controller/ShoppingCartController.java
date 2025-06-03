package io.github.juniorcorzo.UrbanStyle.infrastructure.controller;

import io.github.juniorcorzo.UrbanStyle.application.service.ShoppingCartService;
import io.github.juniorcorzo.UrbanStyle.domain.annotations.constraint.IdFormatConstraint;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.common.ShoppingCartDTO;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.response.ResponseDTO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/shopping-cart")
@RequiredArgsConstructor
@SuppressWarnings("unused")
public class ShoppingCartController {
    private final ShoppingCartService shoppingCardService;

    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseDTO<ShoppingCartDTO> getShoppingCartByUserId(@IdFormatConstraint @RequestParam("user-id") String userId) {
        return this.shoppingCardService.getShoppingCartByUserId(userId);
    }

    @PostMapping("/add-product")
    @PreAuthorize("hasRole('USER')")
    public ResponseDTO<ShoppingCartDTO> createShoppingCart(@Valid @RequestBody ShoppingCartDTO insertShoppingCard) {
        return this.shoppingCardService.addProductsToCart(insertShoppingCard);
    }

    @PatchMapping("/change-quantity")
    @PreAuthorize("hasRole('USER')")
    public ResponseDTO<ShoppingCartDTO> changeQuantityProduct(
            @IdFormatConstraint @RequestParam("user-id") String userId,
            @IdFormatConstraint @RequestParam("product-id") String productId,
            @Min(0) @RequestParam int quantity
    ) {
        return this.shoppingCardService.changeQuantityProduct(userId, productId, quantity);
    }

    @PatchMapping("/update-product")
    @PreAuthorize("hasRole('USER')")
    public ResponseDTO<ShoppingCartDTO> updateProductCart(@Valid @RequestBody ShoppingCartDTO updateShoppingCard) {
        return this.shoppingCardService.updateProductCart(updateShoppingCard);
    }

    @DeleteMapping("/delete-product")
    @PreAuthorize("hasRole('USER')")
    public ResponseDTO<ShoppingCartDTO> removeProductFromCart(
            @IdFormatConstraint @RequestParam("user-id") String userId,
            @IdFormatConstraint @RequestParam("product-id") String productId
    ) {
        return this.shoppingCardService.removeProductCar(userId, productId);
    }

    @DeleteMapping("/delete/{userId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseDTO<ShoppingCartDTO> removeShoppingCart(@IdFormatConstraint @PathVariable String userId) {
        return this.shoppingCardService.removeShoppingCart(userId);
    }

}
