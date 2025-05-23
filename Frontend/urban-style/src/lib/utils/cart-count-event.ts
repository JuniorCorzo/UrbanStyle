export interface CartCountEvent {
  cartLength: number;
}

export function dispatchCartCountEvent(cartLength: number) {
  const event: CartCountEvent = { cartLength };
  const customEvent = new CustomEvent("cart-count", {
    detail: event,
    bubbles: true,
  });

  console.log("Dispatching cart-count event:", event);
  document.dispatchEvent(customEvent);
}
