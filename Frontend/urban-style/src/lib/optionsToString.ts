import type { SelectOptions } from "@/interface/form-mediator.interface";

export function optionsToString(options: SelectOptions | null): string {
  return options?.text ?? "";
}
