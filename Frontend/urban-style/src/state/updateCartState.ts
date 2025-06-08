import type { Cart } from "@/interface/cart.interface";

/**
 * Realiza una petición PUT al endpoint para actualizar el estado del carrito.
 * @param cart - Objeto con los datos del carrito a enviar.
 * @returns Promise<Response>
 */
export function updateCartState(cart: Cart): Promise<Response> {
  return fetch("/api/update-cart-state", {
    method: "PUT",
    body: JSON.stringify(cart),
    headers: {
      "Content-Type": "application/json",
    },
  });
}
