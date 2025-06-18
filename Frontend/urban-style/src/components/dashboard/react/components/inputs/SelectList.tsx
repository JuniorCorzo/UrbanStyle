import type { SelectOptions } from "@/interface/form-mediator.interface";
import type { GetItemsProps, GetMenuProps } from "./Select";
import { cn } from "@/lib/cn";
import SelectItem from "./SelectItem";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

export interface SelectOptionsProps {
  isOpen: boolean;
  options: SelectOptions[];
  highlightedIndex: number;
  selectedItem: SelectOptions | null;
  getItemProps: GetItemsProps<SelectOptions>;
  getMenuProps: GetMenuProps<SelectOptions>;
}

export function SelectList({
  isOpen,
  options,
  getItemProps,
  getMenuProps,
  highlightedIndex,
  selectedItem,
}: SelectOptionsProps) {
  const buttonRef = useRef<HTMLUListElement>(null);
  const [showAbove, setShowAbove] = useState(false);

  useLayoutEffect(() => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;

    console.log(spaceBelow);
    setShowAbove(spaceBelow < 0);
  }, [isOpen]);

  return (
    <ul
      className={cn(
        "w-full  landscape:max-h-52 max-h-80 visible opacity-100 absolute mt-1 p-0 z-20  rounded overflow-y-auto",
        isOpen
          ? "border border-border shadow shadow-crust transition-all duration-150"
          : "invisible opacity-0",
        showAbove && "bottom-full"
      )}
      {...getMenuProps({ ref: buttonRef })}
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
