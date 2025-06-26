import { cn } from "@/lib/cn";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { useState, type DragEvent } from "react";

interface Props extends React.ComponentPropsWithRef<"input"> {}

export default function FileInput({ name, ref, ...props }: Props) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (event: DragEvent) => {
    event.stopPropagation();
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragEnter = (event: DragEvent) => {
    event.stopPropagation();
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent) => {
    event.stopPropagation();
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    setIsDragging(false);
  };

  return (
    <>
      <div
        className={cn(
          "w-full h-48 rounded-lg border-2 border-crust border-dashed bg-background flex justify-center items-center transition-all duration-300 ease-in-out col-span-full group",
          isDragging && "animate-pulse"
        )}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="absolute flex flex-col items-center gap-5">
          <div className="flex items-center justify-center text-accent">
            <ArrowUpTrayIcon className="size-12 stroke-text group-hover:scale-110 transition-all ease-linear" />
          </div>
          <span className="text-center">
            <span className="block text-text font-semibold group-hover:scale-110 transition-all ease-linear ">
              {isDragging
                ? "Suelta los archivos aquí"
                : "Haz clic o arrastra archivos para subirlos"}
            </span>
          </span>
        </div>
        <input
          ref={ref}
          name={name}
          className="h-full w-full opacity-0 cursor-pointer pointer-events-auto"
          type="file"
          {...props}
        />
      </div>
    </>
  );
}
