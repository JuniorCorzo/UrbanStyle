import { useMultipleSelection, useSelect } from "downshift";
import type { SelectInputProps } from "./SelectInput";
import { getItemsFilter } from "@/lib/getItemsFilter";
import type { SelectOptions } from "@/interface/form-mediator.interface";
import { ChevronDownIcon, TrashIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/cn";
import { SelectList } from "./SelectList";

export function SelectMultiple({
  name,
  label,
  placeholder,
  options,
  value,
  search = true,
}: SelectInputProps) {
  const {
    selectedItems,
    getSelectedItemProps,
    getDropdownProps,
    addSelectedItem,
    removeSelectedItem,
  } = useMultipleSelection<SelectOptions>();

  const items = options?.filter(getItemsFilter(selectedItems)) ?? [];
  const {
    isOpen,
    selectedItem,
    getLabelProps,
    getToggleButtonProps,
    getItemProps,
    getMenuProps,
    highlightedIndex,
  } = useSelect({
    selectedItem: null,
    defaultHighlightedIndex: 0,
    items,
    stateReducer: (_, { changes, type }) => {
      switch (type) {
        case useSelect.stateChangeTypes.ToggleButtonKeyDownEnter:
        case useSelect.stateChangeTypes.ToggleButtonKeyDownSpaceButton:
        case useSelect.stateChangeTypes.ItemClick:
          return {
            ...changes,
            isOpen: true,
            highlightedIndex: 0,
          };
      }
      return changes;
    },
    onStateChange: ({ type, selectedItem: newSelectedItem }) => {
      switch (type) {
        case useSelect.stateChangeTypes.ToggleButtonKeyDownEnter:
        case useSelect.stateChangeTypes.ToggleButtonKeyDownSpaceButton:
        case useSelect.stateChangeTypes.ItemClick:
        case useSelect.stateChangeTypes.ToggleButtonBlur:
          console.log(newSelectedItem);
          if (newSelectedItem) {
            addSelectedItem(newSelectedItem);
          }

          break;
        default:
          break;
      }
    },
  });

  return (
    <div className="relative w-full max-w-md">
      <div className="flex flex-col gap-1">
        <label {...getLabelProps()}>{label}</label>
        <div className="w-full bg-background inline-flex p-1 flex-wrap gap-1 items-center border border-border rounded focus-within:custom-ring">
          {selectedItems.map((item, index) => (
            <span
              className="bg-accent flex justify-between items-center rounded-md px-1 py-0.5 focus:custom-ring"
              key={`selected-item-${index}`}
              {...getSelectedItemProps({
                selectedItem: item,
                index,
              })}
            >
              <span>{item.text}</span>
              <span
                className="px-1 cursor-pointer"
                onClick={(event) => {
                  event.stopPropagation();
                  removeSelectedItem(item);
                }}
              >
                &#10005;
              </span>
            </span>
          ))}
          <div
            className="w-full flex justify-between items-center px-2 py-1 cursor-pointer"
            {...getToggleButtonProps(
              getDropdownProps({ preventKeyAction: isOpen })
            )}
          >
            <span className="text-text/70">{placeholder}</span>
            <span>
              <ChevronDownIcon
                className={cn(
                  "size-5 transition-transform duration-150",
                  isOpen && "rotate-180"
                )}
              />
            </span>
          </div>
        </div>
      </div>
      <SelectList
        isOpen={isOpen}
        options={items}
        getMenuProps={getMenuProps}
        getItemProps={getItemProps}
        highlightedIndex={highlightedIndex}
        selectedItem={selectedItem}
      />
    </div>
  );
}
