import type { Cart } from "@/interface/cart.interface";
import { CartService } from "@/service/cart.service";
import { computed, map } from "nanostores";

export const cartStore = map<Cart[]>();

export async function CartStore(userId: string, token: string) {
  if (!cartStore.get().length) {
    console.log(token);
    await fetchAndInsertCart(userId, token);
  }

  const getCartByUserId = () => {
    return cartStore.get().find(({ userId: id }) => id === userId);
  };

  const cartByUser = getCartByUserId();
  if (!cartByUser) {
    await fetchAndInsertCart(userId, token);
    return CartStore(userId, token);
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

const fetchAndInsertCart = async (userId: string, token: string) => {
  await CartService()
    .getCartByUserId(userId, token)
    .then((cart) => {
      const prevCart = !cartStore.get().length ? [] : cartStore.get();
      cartStore.set([...prevCart, cart]);
    })
    .catch((err) => {
      throw Error(err);
    });
};
