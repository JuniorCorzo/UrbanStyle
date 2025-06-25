import { LabelInput } from "./LabelInput";
import { MessageError } from "./MessageError";

interface Props extends React.ComponentPropsWithoutRef<"input"> {
  label: string;
}

export const TextInput = ({ label, name, ...props }: Props) => {
  return (
    <LabelInput label={label}>
      <MessageError errorId={`${name}_error`} />
      <input
        className="w-full h-10 border border-border rounded px-2 py-1 focus:outline-none focus:custom-ring text-text pointer-events-auto"
        name={name}
        {...props}
      />
    </LabelInput>
  );
};

export default TextInput;
