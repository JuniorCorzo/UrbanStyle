package io.github.juniorcorzo.UrbanStyle.infrastructure.controller;

import io.github.juniorcorzo.UrbanStyle.application.service.ShoppingCartService;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.common.ShoppingCartDTO;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.response.ResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/shopping-cart")
@RequiredArgsConstructor
public class ShoppingCartController {
    private final ShoppingCartService shoppingCardService;

    @GetMapping
    public ResponseDTO<ShoppingCartDTO> getShoppingCartByUserId(@RequestParam("user-id") String userId) {
        return this.shoppingCardService.getShoppingCartByUserId(userId);
    }

    @PostMapping("/add-product")
    public ResponseDTO<ShoppingCartDTO> createShoppingCart(@RequestBody ShoppingCartDTO insertShoppingCard) {
        return this.shoppingCardService.addProductsToCart(insertShoppingCard);
    }

    @PatchMapping("/change-quantity")
    public ResponseDTO<ShoppingCartDTO> changeQuantityProduct(
            @RequestParam("user-id") String userId,
            @RequestParam("product-id") String productId,
            @RequestParam int quantity
    ) {
        return this.shoppingCardService.changeQuantityProduct(userId, productId, quantity);
    }

    @PatchMapping("/update-product")
    public ResponseDTO<ShoppingCartDTO> updateProductCart(@RequestBody ShoppingCartDTO updateShoppingCard) {
        return this.shoppingCardService.updateProductCart(updateShoppingCard);
    }

    @DeleteMapping("/delete-product")
    public ResponseDTO<ShoppingCartDTO> removeProductFromCart(@RequestParam("user-id") String userId, @RequestParam("product-id") String productId) {
        return this.shoppingCardService.removeProductCar(userId, productId);
    }

    @DeleteMapping("/delete/{userId}")
    public ResponseDTO<ShoppingCartDTO> removeShoppingCart(@PathVariable String userId) {
        return this.shoppingCardService.removeShoppingCart(userId);
    }

}
