package io.github.juniorcorzo.UrbanStyle.domain.enums;

public enum DocumentsName {
    PRODUCT("Product"),
    CATEGORY("Category"),
    ORDER("Order"),
    USER("User"),
    ADDRESS("Address"),
    IMAGES("Images"),
    SHOPPING_CART("Shopping Cart");

    final String name;
    DocumentsName(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
}
