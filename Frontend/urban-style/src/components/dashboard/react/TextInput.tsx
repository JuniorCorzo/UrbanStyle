import type { FieldProperties } from "@/interface/form-mediator.interface";
import { LabelInput } from "./LabelInput";

type Props = Omit<FieldProperties, "options" | "isMultiple">;

export const TextInput = ({
  label,
  name,
  placeholder,
  value,
  required,
}: Props) => {
  return (
    <LabelInput label={label}>
      <input
        className="h-10 border border-border rounded px-2 py-1 focus:outline-none focus:custom-ring text-text pointer-events-auto"
        type="text"
        id={name}
        name={name}
        placeholder={placeholder}
        value={value}
        required={required}
      />
    </LabelInput>
  );
};

export default TextInput;
