import type { FieldProperties } from "@/interface/form-mediator.interface";
import "@/styles/select.css";
import { SelectMultiple } from "./SelectMultiple";
import { Select } from "./Select";

export interface SelectInputProps extends FieldProperties {
  search?: boolean;
  closeOnSelect?: boolean;
  onChange?: (value: string) => void;
}

export default function SelectInput(Props: SelectInputProps) {
  const { isMultiple } = Props;

  return (
    <>
      {isMultiple && <SelectMultiple {...Props} />}
      {!isMultiple && <Select {...Props} />}
    </>
  );
}
