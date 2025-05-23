import type { Cart } from "@/interface/cart.interface";
import { CartService } from "@/service/cart.service";
import { computed, map } from "nanostores";

export const cartStore = map<Cart[]>();

export async function CartStore(userId: string) {
  if (!cartStore.get().length) {
    await fetchAndInsertCart(userId);
  }

  const getCartByUserId = () => {
    return cartStore.get().find(({ userId: id }) => id === userId);
  };

  const cartByUser = getCartByUserId();
  if (!cartByUser) {
    await fetchAndInsertCart(userId);
    return CartStore(userId);
  }

  const insertProductInCart = (cart: Cart) => {
    const cartIndex = cartStore
      .get()
      .findIndex(({ userId: id }) => userId === id);

    cartStore.get()[cartIndex] = cart;
  };

  const calculateTotal = () => {
    if (!cartByUser.items) {
      return 0;
    }

    return computed(cartStore, (carts) =>
      Number(
        carts
          .find(({ userId: id }) => id === userId)
          ?.items.reduce(
            (acc, { price, quantity }) => acc + price * quantity,
            0
          )
          .toFixed(2) || 0
      )
    ).get();
  };

  return { cartStore, calculateTotal, getCartByUserId, insertProductInCart };
}

const fetchAndInsertCart = async (userId: string) => {
  await CartService()
    .getCartByUserId(userId)
    .then((cart) => {
      const prevCart = !cartStore.get().length ? [] : cartStore.get();
      cartStore.set([...prevCart, cart]);
    });
};
