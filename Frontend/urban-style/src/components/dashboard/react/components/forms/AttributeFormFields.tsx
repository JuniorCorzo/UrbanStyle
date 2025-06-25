import { Button } from "@/components/react/Button";
import { ComboboxInput } from "@/components/react/inputs/ComboboxInput";
import SelectInput from "@/components/react/inputs/SelectInput";
import TextInput from "@/components/react/inputs/TextInput";
import { CLOTHING_COLORS, CLOTHING_SIZE } from "@/const/product.const";
import { cn } from "@/lib/cn";
import {
  ChevronDownIcon,
  ChevronUpDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

interface AttributeFormFieldsProps {
  handleAddAttribute: () => void;
}

export function AttributeFormFields({
  handleAddAttribute,
}: AttributeFormFieldsProps) {
  const [visible, setVisible] = useState(false);
  const handleVisible = () => setVisible((prev) => !prev);

  return (
    <div>
      <span className="w-full flex justify-end items-center cursor-pointer text-crust font-medium">
        <span className="flex items-center gap-2">
          {visible ? (
            <ChevronUpIcon className="size-6" />
          ) : (
            <ChevronDownIcon className="size-6" />
          )}
          <span onClick={handleVisible}>Añadir nuevos atributos</span>
        </span>
      </span>
      <div
        className={cn(
          "bg-background w-full h-full flex flex-col gap-4 transition-all overflow-hidden",
          visible
            ? "animate-slide-down overflow-visible"
            : "max-h-0 animate-slide-up"
        )}
      >
        <ComboboxInput
          label="Color"
          name="color"
          placeholder="Ej: Rojo, Azul, Negro"
          required={true}
          options={CLOTHING_COLORS}
        />
        <SelectInput
          label="Talla"
          name="size"
          placeholder="Ej: S, M, L,"
          required={true}
          options={CLOTHING_SIZE}
        />
        <TextInput
          name="quantity"
          label="Cantidad disponible"
          placeholder="Ej: 10"
        />
        <Button className="w-full" type="button" onClick={handleAddAttribute}>
          Añadir
        </Button>
      </div>
    </div>
  );
}
