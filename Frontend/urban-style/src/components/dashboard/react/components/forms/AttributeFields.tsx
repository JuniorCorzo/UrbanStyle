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
import { useAttributes } from "../../hooks/useAttributes";

export interface AttributesWithId extends Attributes {
  id: string;
}

interface Props {
  name: string;
  defaultAttributes?: AttributesWithId[];
}

export function AttributeFields({ name, defaultAttributes = [] }: Props) {
  const {
    attributes,
    containerRef,
    handleAddAttribute,
    handleChangeQuantity,
    handleRemoveAttribute,
  } = useAttributes(defaultAttributes);
  return (
    <div ref={containerRef} className="w-full flex flex-col gap-4">
      <span className="">
        <h2>Atributos de producto</h2>
      </span>
      <AttributeTable
        attributes={attributes}
        onRemove={handleRemoveAttribute}
        onChangeQuantity={handleChangeQuantity}
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
