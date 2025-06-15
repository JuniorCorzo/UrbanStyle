import type { SelectOptions } from "@/interface/form-mediator.interface";

export function getItemsFilter(selectedItems: SelectOptions[]) {
  return function itemsFilter(item: SelectOptions) {
    return selectedItems.indexOf(item) < 0;
  };
}
