export interface CartCountEvent {
  cartLength: number;
}

export function dispatchCartCountEvent(cartLength: number) {
  const event: CartCountEvent = { cartLength };
  const customEvent = new CustomEvent("cart-count", {
    detail: event,
    bubbles: true,
  });

  document.dispatchEvent(customEvent);
}
