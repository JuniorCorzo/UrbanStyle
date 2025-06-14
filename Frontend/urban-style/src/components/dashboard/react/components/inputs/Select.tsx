import { useSelect } from "downshift";
import type { SelectInputProps } from "./SelectInput";
import { optionsToString } from "@/lib/optionsToString";
import { cn } from "@/lib/cn";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

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
            ></ChevronDownIcon>
          </span>
        </div>
      </div>
      <ul
        className={cn(
          "w-full visible opacity-100 absolute mt-1 shadow shadow-crust max-h-80 transition-all duration-150 overflow-scroll p-0 z-10 border border-border rounded",
          !isOpen && "invisible opacity-0"
        )}
        {...getMenuProps()}
      >
        {isOpen &&
          options?.map(({ text, value }, index) => (
            <li
              className={cn(
                "flex flex-col py-2 px-3 bg-background",
                highlightedIndex === index && "bg-accent",
                selectedItem?.value === value && "bg-accent font-bold"
              )}
              key={value}
              {...getItemProps({ item: { text, value }, index })}
            >
              <span>{text}</span>
            </li>
          ))}
      </ul>
    </div>
  );
}
