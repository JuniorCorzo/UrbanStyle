import { useSelect, type UseSelectReturnValue } from "downshift";
import type { SelectInputProps } from "./SelectInput";
import { optionsToString } from "@/lib/optionsToString";
import { cn } from "@/lib/cn";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import SelectItem from "./SelectItem";
import { SelectList } from "./SelectList";

export type GetItemsProps<T> = UseSelectReturnValue<T>["getItemProps"];
export type GetMenuProps<T> = UseSelectReturnValue<T>["getMenuProps"];

export function Select({
  name,
  label,
  placeholder,
  options,
  value,
  search = true,
}: SelectInputProps) {
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

  return (
    <div className="relative w-full max-w-md">
      <div className="w-full flex flex-col gap-1">
        <label className="pointer-events-none" {...getLabelProps()}>
          {label}
        </label>
        <div
          className="bg-background w-full flex justify-between items-center p-2 cursor-pointer border border-border rounded focus:custom-ring"
          {...getToggleButtonProps()}
        >
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
