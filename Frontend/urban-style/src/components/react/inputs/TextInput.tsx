import type { FieldProperties } from "@/interface/form-mediator.interface";
import { LabelInput } from "./LabelInput";
import { useEffect, useState } from "react";

interface Props
  extends Omit<FieldProperties, "options" | "isMultiple" | "value"> {
  value?: string;
}

export const TextInput = ({
  label,
  name,
  placeholder,
  value,
  required,
}: Props) => {
  const [inputValue, setInputValue] = useState(value);

  return (
    <LabelInput label={label}>
      <input
        className="w-full h-10 border border-border rounded px-2 py-1 focus:outline-none focus:custom-ring text-text pointer-events-auto"
        type="text"
        id={name}
        name={name}
        placeholder={placeholder}
        value={inputValue}
        onChange={() => setInputValue(inputValue)}
        required={required}
      />
    </LabelInput>
  );
};

export default TextInput;
