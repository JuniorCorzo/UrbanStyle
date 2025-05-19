import type { Cart } from "@/interface/cart.interface";
import { CartService } from "@/service/cart.service";
import { map } from "nanostores";

export const cartStore = map<Cart>();

export async function CartStore(userId: string) {
  if (!cartStore.get()) {
    const cart = await CartService().getCartByUserId(userId);
    cartStore.set(cart);
  }

  return { cartStore };
}
