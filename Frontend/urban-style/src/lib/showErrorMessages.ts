export function toggleErrorMessage(
  message: string,
  $spanElement: HTMLSpanElement
) {
  const $iconElement = $spanElement.parentElement?.querySelector("svg");
  const $parentSpanElement = $spanElement.parentElement;

  $spanElement.textContent = message;

  if (message.length > 0) {
    $iconElement?.classList.remove("hidden", "invisible");
    $parentSpanElement?.classList.remove("opacity-0");

    return;
  }

  $iconElement?.classList.add("hidden", "invisible");
  $parentSpanElement?.classList.add("opacity-0");
}

export function toggleErrorMessagesWithLabel(
  message: string,
  $spanElement: HTMLSpanElement
) {
  const $labelElement = $spanElement.parentElement?.parentElement;
  toggleErrorMessage(message, $spanElement);

  if (message.length > 0) {
    $labelElement?.style.setProperty("border-color", "var(--color-maroon)");
    return;
  }

  $labelElement?.style.setProperty("border-color", "transparent");
}
