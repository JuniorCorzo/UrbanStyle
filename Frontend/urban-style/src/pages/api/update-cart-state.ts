import { CartStore } from "@/state/cart.state";
import type { APIRoute } from "astro";

export const PUT: APIRoute = async ({ request }) => {
  const cart = await request.json();
  (await CartStore(cart.userId)).insertProductInCart(cart);

  return new Response(null, {
    status: 204,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
