package io.github.juniorcorzo.UrbanStyle.shopping_cart.infrastructure.controller;

import io.github.juniorcorzo.UrbanStyle.shopping_cart.application.service.ShoppingCartService;
import io.github.juniorcorzo.UrbanStyle.common.domain.annotations.constraint.IdFormatConstraint;
import io.github.juniorcorzo.UrbanStyle.shopping_cart.infrastructure.adapter.dto.ShoppingCartDTO;
import io.github.juniorcorzo.UrbanStyle.common.infrastructure.adapter.dtos.response.ResponseDTO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
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
            @NotBlank @RequestParam String color,
            @NotBlank @RequestParam String size,
            @Min(0) @RequestParam int quantity
    ) {
        return this.shoppingCardService.changeQuantityProduct(userId, productId, color, size, quantity);
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
            @IdFormatConstraint @RequestParam("product-id") String productId,
            @NotBlank @RequestParam String color,
            @NotBlank @RequestParam String size
    ) {
        return this.shoppingCardService.removeProductCar(userId, productId, color, size);
    }

    @DeleteMapping("/delete/{userId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseDTO<ShoppingCartDTO> removeShoppingCart(@IdFormatConstraint @PathVariable String userId) {
        return this.shoppingCardService.removeShoppingCart(userId);
    }

}
