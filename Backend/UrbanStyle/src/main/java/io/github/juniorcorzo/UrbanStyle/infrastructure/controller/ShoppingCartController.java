package io.github.juniorcorzo.UrbanStyle.infrastructure.controller;

import jakarta.websocket.server.PathParam;
import org.springframework.web.bind.annotation.*;

import io.github.juniorcorzo.UrbanStyle.application.service.ShoppingCartService;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.common.ShoppingCartDTO;
import io.github.juniorcorzo.UrbanStyle.infrastructure.adapter.dtos.response.ResponseDTO;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/shopping-cart")
@RequiredArgsConstructor
public class ShoppingCartController {
    private final ShoppingCartService shoppingCardService;

    @GetMapping
    public ResponseDTO<ShoppingCartDTO> getShoppingCartByUserId(@RequestParam("user-id") String userId) {
        return this.shoppingCardService.getShoppingCartByUserId(userId);
    }

    @PostMapping("/create")
    public ResponseDTO<ShoppingCartDTO> createShoppingCart(@RequestBody ShoppingCartDTO insertShoppingCard) {
        return this.shoppingCardService.addProductsToCart(insertShoppingCard);
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
