import { useEffect, useRef, useState } from "react";
import SlimSelect from "slim-select";
import type { FieldProperties } from "@/interface/form-mediator.interface";
import LabelInput from "./LabelInput";
import "@/styles/select.css";

interface SelectInputProps extends FieldProperties {}

export default function SelectInput({
  name,
  label,
  placeholder,
  options,
  value,
  isMultiple,
}: SelectInputProps) {
  const selectRef = useRef<HTMLSelectElement>(null);
  const [selectValue, setSelectValue] = useState(value);

  useEffect(() => setSelectValue(value), [value]);

  useEffect(() => {
    if (selectRef.current) {
      const slim = new SlimSelect({
        select: selectRef.current,
        settings: {
          placeholderText: placeholder,
          closeOnSelect: false,
          allowDeselect: !!isMultiple,
          contentPosition: "fixed",
          contentLocation: document.body,
          showOptionTooltips: true,
        },
      });

      if (selectValue) slim.setSelected(selectValue);
    }
  }, [placeholder, isMultiple, selectValue]);

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
