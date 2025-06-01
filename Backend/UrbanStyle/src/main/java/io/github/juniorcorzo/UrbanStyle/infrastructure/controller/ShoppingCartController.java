package io.github.juniorcorzo.UrbanStyle.infrastructure.controller;

import io.github.juniorcorzo.UrbanStyle.application.service.ShoppingCartService;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.common.ShoppingCartDTO;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.response.ResponseDTO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/shopping-cart")
@RequiredArgsConstructor
@SuppressWarnings("unused")
public class ShoppingCartController {
    private final ShoppingCartService shoppingCardService;

    @GetMapping
    public ResponseDTO<ShoppingCartDTO> getShoppingCartByUserId(@NotBlank @RequestParam("user-id") String userId) {
        return this.shoppingCardService.getShoppingCartByUserId(userId);
    }

    @PostMapping("/add-product")
    public ResponseDTO<ShoppingCartDTO> createShoppingCart(@Valid @RequestBody ShoppingCartDTO insertShoppingCard) {
        return this.shoppingCardService.addProductsToCart(insertShoppingCard);
    }

    @PatchMapping("/change-quantity")
    public ResponseDTO<ShoppingCartDTO> changeQuantityProduct(
            @NotBlank @RequestParam("user-id") String userId,
            @NotBlank @RequestParam("product-id") String productId,
            @Min(0) @RequestParam int quantity
    ) {
        return this.shoppingCardService.changeQuantityProduct(userId, productId, quantity);
    }

    @PatchMapping("/update-product")
    public ResponseDTO<ShoppingCartDTO> updateProductCart(@Valid @RequestBody ShoppingCartDTO updateShoppingCard) {
        return this.shoppingCardService.updateProductCart(updateShoppingCard);
    }

    @DeleteMapping("/delete-product")
    public ResponseDTO<ShoppingCartDTO> removeProductFromCart(
            @NotBlank @RequestParam("user-id") String userId,
            @NotBlank @RequestParam("product-id") String productId
    ) {
        return this.shoppingCardService.removeProductCar(userId, productId);
    }

    @DeleteMapping("/delete/{userId}")
    public ResponseDTO<ShoppingCartDTO> removeShoppingCart(@NotBlank @PathVariable String userId) {
        return this.shoppingCardService.removeShoppingCart(userId);
    }

}
