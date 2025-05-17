import { Children, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function Cell({ children }: Props) {
  return (
    <td className="max-w-72 min-h-11 px-4 py-2 border border-border text-center">
      {children}
    </td>
  );
}
