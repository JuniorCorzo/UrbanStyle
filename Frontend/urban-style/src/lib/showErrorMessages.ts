import type { z } from "zod";
import { $ } from "./dom-selector";

declare global {
  interface HTMLInputElement {
    _clearErrorHandler?: EventListener;
  }
}

export function toggleErrorMessage(
  message: string,
  $spanElement: HTMLSpanElement
) {
  const $iconContainerElement =
    $spanElement.parentElement?.querySelector("span");
  const $parentSpanElement = $spanElement.parentElement;
  const $inputElement =
    $parentSpanElement?.nextElementSibling as HTMLInputElement;

  $spanElement.textContent = message;
  if ($inputElement) createEventListener($spanElement.id, $inputElement);

  $iconContainerElement?.classList.remove("hidden", "invisible");
  $parentSpanElement?.classList.remove("opacity-0");
  return;
}

function createEventListener(id: string, $inputElement: HTMLInputElement) {
  removeEventListener($inputElement);
  $inputElement._clearErrorHandler = clearErrorMessage.bind(
    null,
    id,
    $inputElement
  );
  $inputElement?.addEventListener("input", $inputElement._clearErrorHandler);
}

function removeEventListener($inputElement: HTMLInputElement) {
  if ($inputElement._clearErrorHandler) {
    $inputElement.removeEventListener(
      "input",
      $inputElement._clearErrorHandler
    );
    $inputElement._clearErrorHandler = undefined;
  }
}

export function clearErrorMessage(id: string, $inputElement: HTMLInputElement) {
  const $spanElement = $<HTMLSpanElement>(`#${id}`);
  const $iconContainerElement =
    $spanElement?.parentElement?.querySelector("span");
  const $labelElement = $inputElement.parentElement;

  if ($spanElement?.parentElement) {
    $iconContainerElement?.classList.add("hidden", "invisible");
    $spanElement.parentElement.classList.add("opacity-0");
    $spanElement.textContent = "";
  }

  if ($labelElement instanceof HTMLLabelElement) {
    $labelElement?.style.setProperty("border-color", "transparent");
  }

  removeEventListener($inputElement);
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
}

export const showError = (errors: z.ZodError) => {
  errors.errors.forEach(({ message, path }) => {
    const $errorElement = $<HTMLSpanElement>(`#${path[0]}_error`);
    if ($errorElement) {
      toggleErrorMessagesWithLabel(message, $errorElement);
    }
  });
};
