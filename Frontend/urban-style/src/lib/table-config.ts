import { createTable, getCoreRowModel } from "@tanstack/table-core";
import { atom } from "nanostores";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function createTableConfig(columns: any, data: any) {
  const tableConfig = createTable({
    columns,
    data: data,
    getCoreRowModel: getCoreRowModel(),
    state: {},
    onStateChange: () => {},
    renderFallbackValue: null,
  });

  const tableState = atom(tableConfig.initialState);

  tableState.subscribe((currentState) => {
    tableConfig.setOptions((prev) => ({
      ...prev,
      ...columns,
      ...data,
      state: {
        ...currentState,
        ...columns.state,
        ...data.state,
      },
      onStateChange: (updater) => {
        if (typeof updater === "function") {
          const newState = updater(currentState);
          tableState.set(newState);
        } else {
          tableState.set(updater);
        }
        data?.onStateChange?.(updater);
        columns?.onStateChange?.(updater);
      },
    }));
  });
  return { tableConfig };
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const flexRender = <TProps extends object>(comp: any, props: TProps) => {
  if (typeof comp === "function") {
    return comp(props);
  }
  return comp;
};
