import { ComboboxInput } from "@/components/react/inputs/ComboboxInput";
import SelectInput from "@/components/react/inputs/SelectInput";
import TextInput from "@/components/react/inputs/TextInput";
import { CLOTHING_COLORS, CLOTHING_SIZE } from "@/const/product.const";
import { Button } from "@/components/react/Button";
import { TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import type { Attributes } from "@/interface/product.interface";
import { useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { AttributeTable } from "./AttributeTable";
import { AttributeFormFields } from "./AttributeFormFields";

interface AttributesWithId extends Attributes {
  id: string;
}

interface Props {
  name: string;
  defaultAttributes?: AttributesWithId[];
}

export function AttributeFields({ name, defaultAttributes = [] }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [attributes, setAttributes] = useState<AttributesWithId[]>(
    () => defaultAttributes
  );

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

    setAttributes([...attributes, insertAttribute]);
  };

  const handleRemoveAttribute = (removeId: string) => {
    setAttributes(attributes.filter(({ id }) => id !== removeId));
  };

  return (
    <div ref={containerRef} className="w-full flex flex-col gap-4">
      <span className="">
        <h2>Atributos de producto</h2>
      </span>
      <AttributeTable
        attributes={attributes}
        onRemove={handleRemoveAttribute}
      />
      <AttributeFormFields handleAddAttribute={handleAddAttribute} />
      <input
        name={name}
        className="hidden"
        type="hidden"
        defaultValue={JSON.stringify(attributes)}
        readOnly
      />
    </div>
  );
}
