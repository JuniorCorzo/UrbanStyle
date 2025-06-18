import type { SelectOptions } from "@/interface/form-mediator.interface";
import type { GetItemsProps, GetMenuProps } from "./Select";
import { cn } from "@/lib/cn";
import SelectItem from "./SelectItem";
import { useEffect, useRef, useState } from "react";

export interface SelectOptionsProps {
  showAbove: boolean;
  isOpen: boolean;
  options: SelectOptions[];
  highlightedIndex: number;
  selectedItem: SelectOptions | null;
  getItemProps: GetItemsProps<SelectOptions>;
  getMenuProps: GetMenuProps<SelectOptions>;
}

export function SelectList({
  showAbove,
  isOpen,
  options,
  getItemProps,
  getMenuProps,
  highlightedIndex,
  selectedItem,
}: SelectOptionsProps) {
  return (
    <ul
      className={cn(
        "w-full visible opacity-100 absolute mt-1 shadow shadow-crust max-h-80 transition-all duration-150 p-0 z-20 border border-border rounded overflow-y-auto",
        !isOpen && "invisible opacity-0",
        showAbove && "bottom-full"
      )}
      {...getMenuProps()}
    >
      {isOpen &&
        options?.map(({ text, value }, index) => (
          <SelectItem
            getItemProps={getItemProps}
            highlightedIndex={highlightedIndex}
            index={index}
            item={{ text, value }}
            selectedItem={selectedItem}
            key={value}
          />
        ))}
    </ul>
  );
}
