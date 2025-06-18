import { useSelect, type UseSelectReturnValue } from "downshift";
import type { SelectInputProps } from "./SelectInput";
import { optionsToString } from "@/lib/optionsToString";
import { cn } from "@/lib/cn";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { SelectList } from "./SelectList";
import { useEffect, useRef, useState } from "react";
import { MessageError } from "./MessageError";
import type { SelectOptions } from "@/interface/form-mediator.interface";

export type GetItemsProps<T> = UseSelectReturnValue<T>["getItemProps"];
export type GetMenuProps<T> = UseSelectReturnValue<T>["getMenuProps"];

export function Select({
  className,
  name,
  label,
  placeholder,
  options,
  onChange,
  disable,
  value: defaultValue,
  search = true,
}: SelectInputProps) {
  const buttonRef = useRef<HTMLDivElement>(null);

  const {
    isOpen,
    selectedItem,
    getLabelProps,
    getToggleButtonProps,
    getItemProps,
    getMenuProps,
    highlightedIndex,
  } = useSelect({
    items: options ?? [],
    itemToString: optionsToString,
  });

  useEffect(() => {
    if (!selectedItem?.value) return;

    if (!onChange) return;
    onChange(selectedItem?.value);
  }, [selectedItem]);

  return (
    <div className="relative w-full max-w-md">
      <div
        className={cn(
          "w-full flex flex-col text-text",
          disable && "cursor-not-allowed"
        )}
        ref={buttonRef}
      >
        <label className="pointer-events-none" {...getLabelProps()}>
          {label}
          <MessageError errorId={`${name}_error`} />
          <div
            className={cn(
              "bg-background w-full flex justify-between items-center p-2 cursor-pointer border border-border rounded focus:custom-ring pointer-events-auto",
              disable && "pointer-events-none",
              className
            )}
            {...getToggleButtonProps()}
          >
            <input
              className="hidden"
              type="text"
              name={name}
              value={[selectedItem?.value ?? "", selectedItem?.text ?? ""]}
              readOnly
            />
            <span
              className={cn(
                "text-base text-text/70",
                selectedItem && "text-text"
              )}
            >
              {selectedItem ? selectedItem.text : placeholder}
            </span>
            <span className="">
              <ChevronDownIcon
                className={cn(
                  "size-5 transition-transform duration-150",
                  isOpen && "rotate-180"
                )}
              />
            </span>
          </div>
        </label>
      </div>
      <SelectList
        isOpen={isOpen}
        options={options ?? []}
        getMenuProps={getMenuProps}
        getItemProps={getItemProps}
        highlightedIndex={highlightedIndex}
        selectedItem={selectedItem}
      />
    </div>
  );
}
