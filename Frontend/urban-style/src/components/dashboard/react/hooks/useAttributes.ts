import { useEffect, useRef, useState } from "react";
import type { AttributesWithId } from "../components/forms/AttributeFields";
import { useStore } from "@nanostores/react";
import { attributeStore } from "@/state/attributes.state";
import { ZodError } from "zod";
import { showError } from "@/lib/showErrorMessages";
import { AttributesScheme } from "@/lib/validations/product.validations";

export function useAttributes(defaultAttributes: AttributesWithId[]) {
  const containerRef = useRef<HTMLDivElement>(null);
  const attributes = useStore(attributeStore);

  useEffect(() => attributeStore.set(defaultAttributes), []);

  const handleChangeQuantity = (id: string, quantity: number) => {
    console.log(quantity);
    attributeStore.set(
      attributes.map((attr) => (attr.id === id ? { ...attr, quantity } : attr))
    );
  };

  const getAttributesInputs = ($container: HTMLDivElement) => {
    const $colorCombobox = $container.querySelector<HTMLInputElement>(
      "input[name='color']"
    );
    const $sizeSelect =
      $container.querySelector<HTMLInputElement>("input[name='size']");
    const $quantityInput = $container.querySelector<HTMLInputElement>(
      "input[name='quantity']"
    );
    return { $colorCombobox, $sizeSelect, $quantityInput };
  };

  const handleAddAttribute = () => {
    if (!containerRef.current) return;
    const $container = containerRef.current;
    const { $colorCombobox, $quantityInput, $sizeSelect } =
      getAttributesInputs($container);

    const insertAttribute: AttributesWithId = {
      id: crypto.randomUUID(),
      color: $colorCombobox?.value ?? "",
      size: $sizeSelect?.value.split(",")[1] ?? "",
      quantity: Number($quantityInput?.value) ?? 0,
    };

    const isDuplicate = attributes.some(
      ({ color, size }) =>
        size === insertAttribute.size && color === insertAttribute.color
    );
    if (isDuplicate) return;

    try {
      AttributesScheme.parse(insertAttribute);
      attributeStore.set([...attributes, insertAttribute]);
    } catch (err) {
      if (err instanceof ZodError) showError(err);
    }
  };

  const handleRemoveAttribute = (removeId: string) => {
    attributeStore.set(attributes.filter(({ id }) => id !== removeId));
  };

  return {
    attributes,
    containerRef,
    handleAddAttribute,
    handleChangeQuantity,
    handleRemoveAttribute,
  };
}
