import type { SelectOptions } from "@/interface/form-mediator.interface";
import { useMemo, useState, type KeyboardEvent } from "react";
import type { SelectInputProps } from "./SelectInput";
import { getItemsFiltered } from "@/lib/getItemsFilter";
import { useCombobox, useMultipleSelection } from "downshift";
import { optionsToString } from "@/lib/optionsToString";
import { cn } from "@/lib/cn";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { SelectList } from "./SelectList";
import type { ComboboxInputProps } from "./ComboboxInput";

export function ComboboxMultiple({
  name,
  label,
  placeholder,
  options,
  value = [],
}: ComboboxInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [selectedItems, setSelectedItems] = useState<SelectOptions[]>([]);
  const items: SelectOptions[] = useMemo(
    () => getItemsFiltered(options ?? [], selectedItems, inputValue),
    [inputValue, selectedItems]
  );

  const { getSelectedItemProps, getDropdownProps, removeSelectedItem } =
    useMultipleSelection({
      selectedItems: [...selectedItems],
      onStateChange({ selectedItems: newSelectedItems, type }) {
        switch (type) {
          case useMultipleSelection.stateChangeTypes
            .SelectedItemKeyDownBackspace:
          case useMultipleSelection.stateChangeTypes.SelectedItemKeyDownDelete:
          case useMultipleSelection.stateChangeTypes.DropdownKeyDownBackspace:
          case useMultipleSelection.stateChangeTypes.FunctionRemoveSelectedItem:
            if (!newSelectedItems) return;

            setSelectedItems(newSelectedItems);
            break;
          default:
            break;
        }
      },
    });

  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getItemProps,
    getInputProps,
    selectedItem,
    highlightedIndex,
  } = useCombobox({
    items,
    itemToString(item) {
      return optionsToString(item);
    },
    defaultHighlightedIndex: 0,
    selectedItem: null,
    inputValue,
    stateReducer(_, { type, changes }) {
      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          return {
            ...changes,
            isOpen: true, // keep the menu open after selection.
            highlightedIndex: 0, // with the first option highlighted.
          };
        default:
          return changes;
      }
    },
    onStateChange({
      inputValue: newInputValue,
      type,
      selectedItem: newSelectedItem,
    }) {
      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
        case useCombobox.stateChangeTypes.InputBlur:
          if (newSelectedItem && isOpen) {
            setSelectedItems([...selectedItems, newSelectedItem]);
            setInputValue("");
          }
          break;

        case useCombobox.stateChangeTypes.InputChange:
          setInputValue(newInputValue || "");
          break;
        default:
          break;
      }
    },
  });

  const handleEnter = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;

    const $input = event.target as HTMLInputElement;
    const value = $input.value;
    const valueLowerCase = value.toLowerCase();
    const isDuplicate = selectedItems.some(
      (selectedItem) => selectedItem.value === valueLowerCase
    );

    if (!value || isDuplicate) return;
    setSelectedItems([
      ...selectedItems,
      { text: value, value: valueLowerCase },
    ]);
    console.log($input.value);
    setInputValue("");
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="flex flex-col gap-1">
        <label className="pointer-events-none" {...getLabelProps()}>
          {label}
          <div className="w-full bg-background inline-flex p-1 flex-wrap gap-1 items-center border border-border rounded focus-within:custom-ring pointer-events-auto">
            <input
              className="hidden"
              name={name}
              type="text"
              readOnly
              defaultValue={JSON.stringify(selectedItems)}
            />
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
            <div className="w-full flex justify-between items-center px-2 py-1 cursor-pointer">
              <input
                placeholder={placeholder}
                className="w-full focus:outline-0"
                {...getInputProps({
                  onKeyDown: handleEnter,
                  ...getDropdownProps({ preventKeyAction: isOpen }),
                })}
              />
              <button {...getToggleButtonProps()}>
                <ChevronDownIcon
                  className={cn(
                    "size-5 transition-transform duration-150",
                    isOpen && "rotate-180"
                  )}
                />
              </button>
            </div>
          </div>
        </label>
      </div>
      <SelectList
        getItemProps={getItemProps}
        getMenuProps={getMenuProps}
        options={items}
        highlightedIndex={highlightedIndex}
        isOpen={isOpen}
        selectedItem={selectedItem}
      />
    </div>
  );
}
