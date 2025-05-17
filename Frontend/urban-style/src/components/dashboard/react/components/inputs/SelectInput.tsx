import { useEffect, useRef, useState } from "react";
import SlimSelect from "slim-select";
import type { FieldProperties } from "@/interface/form-mediator.interface";
import LabelInput from "./LabelInput";
import "@/styles/select.css";

interface SelectInputProps extends FieldProperties {
  search?: boolean;
  closeOnSelect?: boolean;
  onChange?: (value: string) => void;
}

export default function SelectInput({
  name,
  label,
  placeholder,
  options,
  value,
  isMultiple,
  search = true,
  closeOnSelect = false,
  onChange,
}: SelectInputProps) {
  const selectRef = useRef<HTMLSelectElement>(null);
  const [selectValue, setSelectValue] = useState(value);

  useEffect(() => setSelectValue(value), [value]);
  useEffect(() => {
    if (onChange) {
      onChange(selectValue as string);
    }
  }, [selectValue]);

  useEffect(() => {
    if (selectRef.current) {
      const slim = new SlimSelect({
        select: selectRef.current,
        events: {
          afterChange(newVal) {
            if (newVal.length > 1) {
              return;
            }
            console.log(newVal[0].value);
            setSelectValue(() => newVal[0].value);
          },
        },
        settings: {
          placeholderText: placeholder,
          closeOnSelect: closeOnSelect,
          allowDeselect: !!isMultiple,
          contentPosition: "fixed",
          contentLocation: document.body,
          showOptionTooltips: true,
          showSearch: search,
        },
      });

      if (selectValue) slim.setSelected(selectValue);
    }
  }, [placeholder, isMultiple]);

  return (
    <LabelInput label={label}>
      <select
        ref={selectRef}
        className="w-full border-border rounded"
        multiple={isMultiple}
        name={name}
        data-name={name}
        data-is-multiple={isMultiple}
        data-placeholder={placeholder}
      >
        {options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.text}
          </option>
        ))}
      </select>
    </LabelInput>
  );
}
