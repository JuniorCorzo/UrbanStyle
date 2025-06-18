import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

interface Props {
  errorId: string;
}

export function MessageError({ errorId }: Props) {
  return (
    <span className="flex gap-1 items-center text-maroon opacity-0 transition-opacity duration-300">
      <span className="hidden invisible min-w-6 min-h-6">
        <ExclamationCircleIcon className="size-6" />
      </span>
      <span
        id={errorId}
        className="transition-all text-pretty font-bold"
      ></span>
    </span>
  );
}
