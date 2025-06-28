import type { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
  label?: string;
}

export function LabelInput({ label, children }: Props) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: <explanation>
    <label className="w-full flex flex-col gap-1">
      <span>{`${label}`}</span>
      {children}
    </label>
  );
}
export default LabelInput;
