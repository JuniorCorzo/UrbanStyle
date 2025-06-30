import type { FieldProperties } from "@/interface/form-mediator.interface";
import LabelInput from "./LabelInput";
import { useState } from "react";
import { MessageError } from "./MessageError";

export interface TextAreaProps
  extends Omit<FieldProperties, "value" | "options"> {
  value?: string;
}

export function TextAreaInput({
  className,
  disable,
  label,
  name,
  placeholder,
  required,
  value = "",
}: TextAreaProps) {
  return (
    <LabelInput label={label}>
      <MessageError errorId={`${name}_error`} />
      <span>
        <textarea
          className="w-full min-h-16 max-h-32 border border-border focus:custom-ring p-2 field-sizing-content"
          name={name}
          placeholder={placeholder}
          defaultValue={value}
        />
      </span>
    </LabelInput>
  );
}
